var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	priorityCountry: String,
	priorityFilingNumber: String,
	priorityDate: Date
});