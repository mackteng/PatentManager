var mongoose = require('mongoose');
var Contact = require('./contact.js');

var clientSchema = new mongoose.Schema({
	_id : Number,	
	englishName: String,
	chineseName: String,
	address : String,
	telephone : String,
	contacts : [Contact]
});

module.exports = mongoose.model('Client', clientSchema); 