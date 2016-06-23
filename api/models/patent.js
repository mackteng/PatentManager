var mongoose = require('mongoose');
var Priority = require('./priority.js');
var Inventor = require('./inventor.js');
var Event = require('./event.js');

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
		required: true,
    enum: ['US', 'TW', 'CN', 'JP', 'KR', 'EU']
	},
	applicationType: {
		type: String,
		required: true,
    enum:['Patent']
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
  lastDeadline : {
    type: Event
  },
	eventHistory : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventHistory'
  },
	active : {
		type: Boolean,
		required: true
	},
  publicationDate: Date,
  patentExpirationDate: Date
});


// set compound index for clientID and clientDocketNumber
patentSchema.index({"clientID" : 1, "docketNumber" : 1}, {unique: true});

// set virtual getter for full docket
patentSchema.virtual('FullDocketNumber').get(function(){
	return this.clientId + '.' + this.docketNumber + this.country;
});

mongoose.model('Patent', patentSchema);
