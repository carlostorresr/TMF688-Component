const mongoose = require('mongoose');

const HubSchema = new mongoose.Schema({
  callback: { type: String, required: true },
  query: { type: String },
  topicId: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hub', HubSchema);