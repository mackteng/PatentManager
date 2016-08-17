var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	inventorChineseName: String,
	inventorEnglishName: String,
	inventorCountry: String,
	inventorAddress: String,
	inventorIdentification: String
});
