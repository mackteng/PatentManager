var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	name : String,
	telephone : String,
	email: String
});
