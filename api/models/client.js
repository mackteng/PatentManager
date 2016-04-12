var mongoose = require('mongoose');
var Contact = require('./contact.js');

var clientSchema = new mongoose.Schema({
	_id : {
		type: Number,
		required: true
	},
	englishName: {
		type: String,
		required: true
	},
	chineseName: {
		type: String,
		required: true
	},
	address : String,
	telephone : String,
	contacts : [Contact]
});

mongoose.model('Client', clientSchema); 