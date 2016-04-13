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
			_id : req.body.clientNumber,
			englishName: req.body.englishName,
			chineseName: req.body.chineseName,
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

	PUT /api/clients/:clientid/contacts

**/

module.exports.addContacts = function(req, res){
	
	var clientNumber = req.params.clientid;
	var contacts = req.body.contacts;
	
	if(!clientNumber){
		return sendJsonResponse(res, "No Client Specified", 400);	
	}
	
	if(!contacts){
		return sendJsonResponse(res, "No Contacts Provided", 400);	
	}
		
	Client
		.findById(clientNumber)
		.select('contacts')
		.exec(function(err, client){
			
			if(err){
				return sendJsonResponse(res, err, 400);	
			}
		
			if(!client){
				return sendJsonReponse(res, "No Client Found", 404);	
			}
		
			// push every contact in array to the contacts array in our document	
			for(var i = 0; i < contacts.length; i++){
				client.contacts.push(contacts[i]);
			}
		
			// save when done
			client.save(function(err, client){
				if(err){
					return sendJsonResponse(res, err, 400);
				}
				sendJsonResponse(res, client.contacts, 200);
			});
		});
}
/**

	Update Client 
	PUT /api/clients/:clientid

**/
module.exports.updateClient = function(req, res){
	
	if(!req.params || !req.params.clientid){
		return sendJsonResponse(res, "No ClientID Found", 404);
	}

	Client
		.findById(req.params.clientid)
		.exec(function(err, client){
			if(err){
				return sendJsonReponse(res, err, 400);
			}
			if(!client){
				return sendJsonReponse(res, "No Such Client Found", 404);
			}

			for(var field in Client.schema.paths){
				if(field != '_id' && field != '_v'){
					if(req.body[field]){
						client[field] = req.body[field];
					}
				}
			}
			
			client.save(function(err){
				if(err){
					return sendJsonReponse(res, err, 400);
				}
				
				sendJsonResponse(res, client, 200);
			});
		});
};


// impelemnt user controls
module.exports.deleteClient = function(req, res){
	
	
	
};
