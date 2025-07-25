'use strict';

const mongoUtils = require('../utils/mongoUtils');
const swaggerUtils = require('../utils/swaggerUtils');
const notificationUtils = require('../utils/notificationUtils');

const {TError, TErrorEnum, sendError} = require('../utils/errorUtils');
const {sendDoc} = require('../utils/mongoUtils');
const {setBaseProperties, traverse, 
       addHref, processCommonAttributes } = require('../utils/operationsUtils');

const {validateRequest} = require('../utils/ruleUtils');

const {processAssignmentRules} = require('../utils/operations');

const {getPayloadType, getPayloadSchema, getResponseType} = require('../utils/swaggerUtils');

const {updateQueryServiceType, updatePayloadServiceType, cleanPayloadServiceType} = require('../utils/swaggerUtils');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

exports.createHub = function(req, res, next) {
  console.log("[DEBUG] Entró a service HubService.createHub");
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");

  const resourceType = getResponseType(req);
  const requestSchema = getPayloadSchema(req);

  console.log('createHub :: ' + req.method + ' ' + req.url + ' ' + req.headers.host + ' ' + resourceType);

  swaggerUtils.getPayload(req)
    .then(payload => validateRequest(req, 'createHub', payload))
    .then(payload => {
      const topicId = req.swagger.params.topicId.value;
      payload.topicId = topicId;
      payload.id = Math.random().toString(36).substr(2, 9);
      payload.href = req.protocol + '://' + req.headers.host + req.originalUrl + '/' + payload.id;

      mongoUtils.connect().then(db => {
        db.collection('hub')
          .insertOne(payload)
          .then(() => sendDoc(res, 201, payload))
          .catch(error => sendError(res, internalError));
      }).catch(error => sendError(res, internalError));
    })
    .catch(error => sendError(res, error));
};

exports.listHub = function(req, res, next) {
  const topicId = req.swagger.params.topicId.value;
  const query = { topicId: topicId };
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");

  mongoUtils.connect().then(db => {
    db.collection('hub')
      .find(query).toArray()
      .then(doc => sendDoc(res, 200, doc))
      .catch(error => sendError(res, internalError));
  }).catch(error => sendError(res, internalError));
};

exports.retrieveHub = function(req, res, next) {
  const topicId = req.swagger.params.topicId.value;
  const id = req.swagger.params.id.value;
  const query = { topicId: topicId, id: id };
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");

  mongoUtils.connect().then(db => {
    db.collection('hub')
      .findOne(query)
      .then(doc => {
        if (!doc) {
          return sendError(res, new TError(TErrorEnum.RESOURCE_NOT_FOUND, "No Hub found with given id and topic"));
        }
        sendDoc(res, 200, doc);
      })
      .catch(error => sendError(res, internalError));
  }).catch(error => sendError(res, internalError));
};

exports.deleteHub = function(req, res, next) {
  const topicId = req.swagger.params.topicId.value;
  const id = req.swagger.params.id.value;
  const query = { topicId: topicId, id: id };
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");

  mongoUtils.connect().then(db => {
    db.collection('hub')
      .deleteOne(query)
      .then(result => {
        if (result.deletedCount === 0) {
          return sendError(res, new TError(TErrorEnum.RESOURCE_NOT_FOUND, "No Hub found to delete"));
        }
        res.statusCode = 204;
        res.end();
      })
      .catch(error => sendError(res, internalError));
  }).catch(error => sendError(res, internalError));
};
