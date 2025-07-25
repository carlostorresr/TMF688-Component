'use strict';

const mongoUtils = require('../utils/mongoUtils');
const swaggerUtils = require('../utils/swaggerUtils');
const { TError, TErrorEnum, sendError } = require('../utils/errorUtils');
const { sendDoc } = require('../utils/mongoUtils');
const { validateRequest } = require('../utils/ruleUtils');

exports.createEvent = function(req, res, next) {
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");
  const topicId = req.swagger.params.topicId.value;
  const resourceType = swaggerUtils.getResponseType(req);
  const requestSchema = swaggerUtils.getPayloadSchema(req);

  swaggerUtils.getPayload(req)
    .then(payload => validateRequest(req, 'createEvent', payload))
    .then(payload => {
      payload.id = Math.random().toString(36).substr(2, 9);
      payload.href = req.protocol + '://' + req.headers.host + req.originalUrl + '/' + payload.id;
      payload.topicId = topicId;

      mongoUtils.connect().then(db => {
        db.collection('event')
          .insertOne(payload)
          .then(() => sendDoc(res, 201, payload))
          .catch(() => sendError(res, internalError));
      }).catch(() => sendError(res, internalError));
    })
    .catch(error => sendError(res, error));
};

exports.listEvent = function(req, res, next) {
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");
  const topicId = req.swagger.params.topicId.value;

  mongoUtils.connect().then(db => {
    db.collection('event')
      .find({ topicId }).toArray()
      .then(doc => sendDoc(res, 200, doc))
      .catch(() => sendError(res, internalError));
  }).catch(() => sendError(res, internalError));
};

exports.retrieveEvent = function(req, res, next) {
  const id = req.swagger.params.id.value;
  const topicId = req.swagger.params.topicId.value;
  const internalError = new TError(TErrorEnum.INTERNAL_SERVER_ERROR, "Internal database error");

  mongoUtils.connect().then(db => {
    db.collection('event')
      .findOne({ id, topicId })
      .then(doc => {
        if (!doc) {
          return sendError(res, new TError(TErrorEnum.RESOURCE_NOT_FOUND, "No Event found with given id"));
        }
        sendDoc(res, 200, doc);
      })
      .catch(() => sendError(res, internalError));
  }).catch(() => sendError(res, internalError));
};