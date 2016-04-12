var mongoose = require('mongoose');
var Client = mongoose.model('Client');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

/**

	Returns a list of all the clients
	
**/

module.exports.listAllClients = function(req, res){
	Client
		.find()
		.exec(function(err, clients){
			if(err){
				sendJsonResponse(res, err, 400);
			} else {
				sendJsonResponse(res, clients, 200);	
			}
		});
};

/**
	Creates a new client with no contacts
	
	Parameters:
	
	  Required:
		_id : Number,
		englishName: String,
		chineseName: String,
		
	   Optional:
		address	   : String,
		telephone  : String
			
**/
module.exports.createClient = function(req, res){
	Client.create({
			_id : req.body.clientnumber,
			englishName: req.body.englishname,
			chineseName: req.body.chinesename,
			address: req.body.address,
			telephone: req.body.telephone,
	}, function(err, client){
		if(err){
			sendJsonResponse(res, err, 400);
		} else {
			sendJsonResponse(res, client, 200);	
		}
	});
};



/** 

	Adds new contact(s) into an existing client 

**/

module.exports.addContact = function(req, res){
	
	var clientNumber = req.body.clientnumber;
	var contacts = req.body.contacts;
	
	if(!clientNumber){
		return sendJsonResponse(res, "No Client Specified", 400);	
	}
	
	if(!contacts){
		return sendJsonResponse(res, "No Contacts Added", 400);	
	}
	
	
	Client
		.findById(clientNumber)
		.exec(function(err, client){
			
			if(err){
				return sendJsonResponse(res, err, 400);	
			}
		
			if(!client){
				return sendJsonReponse(res, "No Client Found", 404);	
			}
		
		
			for(var i = 0; i < contacts.length; i++){
				client.contacts.push(contacts[i]);
			}
		
			client.save(function(err, client){
				if(err){
					return sendJsonResponse(res, err, 400);
				}
				sendJsonResponse(res, client, 200);
			});
		});
}

module.exports.updateClient = function(req, res){
	
	
	
};


// impelemnt user controls
module.exports.deleteClient = function(req, res){
	
	
	
};
