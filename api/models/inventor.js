var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	inventorName: String,
	inventorCountry: String,
});