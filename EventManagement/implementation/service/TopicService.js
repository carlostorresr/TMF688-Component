'use strict';

const mongoUtils = require('../utils/mongoUtils');
const swaggerUtils = require('../utils/swaggerUtils');
const { TError, TErrorEnum, sendError } = require('../utils/errorUtils');
const { sendDoc } = require('../utils/mongoUtils');
const { validateRequest } = require('../utils/ruleUtils');

exports.createTopic = function(req, res, next) {
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");
  const resourceType = swaggerUtils.getResponseType(req);
  const requestSchema = swaggerUtils.getPayloadSchema(req);

  swaggerUtils.getPayload(req)
    .then(payload => validateRequest(req, 'createTopic', payload))
    .then(payload => {
      payload.id = Math.random().toString(36).substr(2, 9);
      payload.href = req.protocol + '://' + req.headers.host + req.originalUrl + '/' + payload.id;

      mongoUtils.connect().then(db => {
        db.collection('topic')
          .insertOne(payload)
          .then(() => sendDoc(res, 201, payload))
          .catch(() => sendError(res, internalError));
      }).catch(() => sendError(res, internalError));
    })
    .catch(error => sendError(res, error));
};

exports.listTopic = function(req, res, next) {
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");
  mongoUtils.connect().then(db => {
    db.collection('topic')
      .find({}).toArray()
      .then(doc => sendDoc(res, 200, doc))
      .catch(() => sendError(res, internalError));
  }).catch(() => sendError(res, internalError));
};

exports.retrieveTopic = function(req, res, next) {
  const id = req.swagger.params.id.value;
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");
  mongoUtils.connect().then(db => {
    db.collection('topic')
      .findOne({ id })
      .then(doc => {
        if (!doc) {
          return sendError(res, new TError(TErrorEnum.RESOURCE_NOT_FOUND, "No Topic found with given id"));
        }
        sendDoc(res, 200, doc);
      })
      .catch(() => sendError(res, internalError));
  }).catch(() => sendError(res, internalError));
};

exports.deleteTopic = function(req, res, next) {
  const id = req.swagger.params.id.value;
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");

  mongoUtils.connect().then(db => {
    db.collection('topic')
      .deleteOne({ id })
      .then(result => {
        if (result.deletedCount === 0) {
          return sendError(res, new TError(TErrorEnum.RESOURCE_NOT_FOUND, "No Topic found to delete"));
        }
        res.statusCode = 204;
        res.end();
      })
      .catch(() => sendError(res, internalError));
  }).catch(() => sendError(res, internalError));
};
