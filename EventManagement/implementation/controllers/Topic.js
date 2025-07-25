'use strict';

const topic = require('../service/TopicService');

module.exports.createTopic = function createTopic(req, res, next) {
  topic.createTopic(req, res, next);
};

module.exports.listTopic = function listTopic(req, res, next) {
  topic.listTopic(req, res, next);
};

module.exports.retrieveTopic = function retrieveTopic(req, res, next) {
  topic.retrieveTopic(req, res, next);
};

module.exports.deleteTopic = function deleteTopic(req, res, next) {
  topic.deleteTopic(req, res, next);
};
