'use strict';

var url = require('url');

const hub = require('../service/HubService');

module.exports.createHub = function createHub(req, res, next) {
  console.log("[DEBUG] Entró a controller Hub.createHub");
  hub.createHub(req, res, next);
};

module.exports.listHub = function listHub(req, res, next) {
  hub.listHub(req, res, next);
};

module.exports.retrieveHub = function retrieveHub(req, res, next) {
  hub.retrieveHub(req, res, next);
};

module.exports.deleteHub = function deleteHub(req, res, next) {
  hub.deleteHub(req, res, next);
};
