var mongoose = require('mongoose');
var Priority = require('./priority.js');
var Inventor = require('./inventor.js');


var clientExistsValidator = function(clientId, response){
    this.model('Client')
        .findById(clientId)
        .exec(function(err, client){
            if(err || !client) {
							response(false);
						}
            else
							response(true);
        });
}


// define schema for patent application
var patentSchema = new mongoose.Schema({

	// clientID holds the reference to the client this patent application belongs to
	// Use custom validator to mimic foreign key constraint
	clientId :	{
		type: String,
		ref: 'Client' ,
		required : true,
		validate: clientExistsValidator
	},
	docketNumber: {
		type: Number,
		required: true
	},
  clientDocketNumber:{
    type: String,
  },
	country: {
		type: String,
		required: true
	},
	applicationType: {
		type: String,
		required: true
	},
	filingDate: {
		type: Date,
		required: true
	},
	filingNumber: {
		type: String,
		required: true
	},
	englishTitle: {
		type: String,
	},
	chineseTitle: String,
  issueNumber: String,
	priority: Priority,
	inventors: [Inventor],
	eventHistory : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventHistory'
  },
	active : {
		type: Boolean,
		required: true
	}
});


// set compound index for clientID and clientDocketNumber
patentSchema.index({"clientID" : 1, "docketNumber" : 1}, {unique: true});

// set virtual getter for full docket
patentSchema.virtual('FullDocketNumber').get(function(){
	return this.clientId + '.' + this.docketNumber + this.country;
});

mongoose.model('Patent', patentSchema);
