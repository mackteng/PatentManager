var mongoose = require('mongoose');
var Event = require('./event.js');

var eventHistorySchema = new mongoose.Schema({
  patentId: String,
  eventHistory : [Event]
});

mongoose.model('EventHistory', eventHistorySchema);
