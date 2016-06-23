var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	eventName : {
		type: String,
		required: true
	},
	eventDeadline: Date,
	eventNote: String
});

mongoose.model('Event', eventSchema);
