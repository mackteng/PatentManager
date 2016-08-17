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

  //Client ID eg: 6101
	clientId :	{
		type: String,
		ref: 'Client',
		required : true,
		validate: clientExistsValidator
	},
  // Docket Number for Client, eg: 012
	docketNumber: {
		type: String,
		required: true
	},
  litronDocketNumber: {
    type: String
  },
  // Client's Docket Number, eg: RD1002
  clientDocketNumber:{
    type: String,
  },
	country: {
		type: String,
		required: true,
    enum: ['US', 'TW', 'CN', 'JP', 'KR', 'EP']
	},
	patentType: {
		type: String,
		required: true,
    enum:['Patent','Utility']
	},
  applicationType:{
    type: String,
    required: true,
    enum:['REG', 'DIV', 'CA', 'CIP', 'PRO']
  },
	filingDate: {
		type: Date,
		required: true
	},
	filingNumber: {
		type: String,
		required: true
	},
	englishTitle: String,
	chineseTitle: String,
	priority: [Priority],
	inventors: [Inventor],
	status : {
		type: String,
    enum: ['Active', 'Abandoned', 'Allowed'],
		required: true
	},
  publicationDate: Date,
  issueNumber: String,
  patentExpirationDate: Date,
  comments:{
    type: [String]
  }
});

patentSchema.pre('save', function(next) {
    this.litronDocketNumber = this.clientId+'.'+this.docketNumber+this.country.toUpperCase();
    next();
});
// set compound index for clientID and clientDocketNumber
patentSchema.index({"clientID" : 1, "docketNumber" : 1, "country" : 1, "applicationType" : 1}, {unique: true});
mongoose.model('Patent', patentSchema);
