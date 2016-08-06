var mongoose = require('mongoose');
var Event = require('./event.js');
var email = new mongoose.Schema({
  notifyEvent: {
    type: Event,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  }
});
mongoose.model('Email', email);
