var mongoose = require('mongoose');
var Contact = require('./contact.js');

var clientSchema = new mongoose.Schema({
	_id : {
		type: String,
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
	chineseAddress : String,
	englishAddress : String,
	identificationNumber : String,
	repChineseName: String,
	repEnglishName: String,
	telephone : String,
	contacts : [Contact],
	comment : String
});

mongoose.model('Client', clientSchema);
