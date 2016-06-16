var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	eventName : String,
	eventDeadline: Date,
	eventNote: String
});

mongoose.model('Event', eventSchema);
