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
	Returns a specific client
**/

module.exports.listOneClient = function(req, res){
	if(!req.params || !req.params.clientid){
		return sendJsonResponse(res, "No ClientId specified", 400);
	}

	Client
		.findById(req.params.clientid)
		.exec(function(err, client){
				if(err){
					return sendJsonResponse(res, err, 400);
				}

				if(!client){
					return sendJsonResponse(res, "No Such Client Found", 404);
				}

				sendJsonResponse(res, client, 200);
		});
}


/**
	Creates a new client
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
			comment: req.body.comment,
			englishName: req.body.englishName,
			chineseName: req.body.chineseName,
			chineseAddress: req.body.chineseAddress,
			englishAddress: req.body.englishAddress,
			telephone: req.body.telephone,
			contacts: req.body.contacts,
			identificationNumber : req.body.identificationNumber,
			repChineseName : req.body.repChineseName,
			repEnglishName : req.body.repEnglishName
	}, function(err, client){
		if(err){
			sendJsonResponse(res, err, 400);
		} else {
			sendJsonResponse(res, client, 200);
		}
	});
};



/**
	Partially Update Client
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
				return sendJsonResponse(res, err, 400);
			}
			if(!client){
				return sendJsonResponse(res, "No Such Client Found", 404);
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
					return sendJsonResponse(res, err, 400);
				}

				sendJsonResponse(res, client, 200);
			});
		});
};


// implement user controls
module.exports.deleteClient = function(req, res){



};
