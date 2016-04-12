var mongoose = require('mongoose');
var Client = mongoose.model('Client');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

module.exports.listAllClients = function(req, res){
	
	// returns all clients
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

module.exports.createClient = function(req, res){
	
	
	
};

module.exports.updateClient = function(req, res){
	
	
	
};

module.exports.deleteClient = function(req, res){
	
	
	
};
