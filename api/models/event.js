var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	eventName : {
		type: String,
		required: true
	},
	eventDeadline: Date,
	eventNote: String,
	completed : Boolean
});

module.exports = eventSchema;

mongoose.model('Event', eventSchema);
