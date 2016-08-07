var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	patentID:{
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	eventName : {
		type: String,
		required: true
	},
	eventDeadline: {
		type: Date,
		required: true
	},
	eventNote: String,
	completed : Boolean
});

module.exports = eventSchema;

mongoose.model('Event', eventSchema);
