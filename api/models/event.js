var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	
	eventName : String,
	eventDeadline: Date,
	eventNote: String
});

	