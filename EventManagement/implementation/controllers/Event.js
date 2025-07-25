'use strict';

const event = require('../service/EventService');

module.exports.createEvent = function createEvent(req, res, next) {
  event.createEvent(req, res, next);
};

module.exports.listEvent = function listEvent(req, res, next) {
  event.listEvent(req, res, next);
};

module.exports.retrieveEvent = function retrieveEvent(req, res, next) {
  event.retrieveEvent(req, res, next);
};