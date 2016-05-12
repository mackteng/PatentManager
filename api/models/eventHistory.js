var mongoose = require('mongoose');
var Event = require('./event.js');

var eventHistorySchema = new mongoose.Schema({
  eventHistory : [Event]
});

mongoose.model('EventHistory', eventHistorySchema);
