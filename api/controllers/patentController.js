var mongoose = require('mongoose');
var Patent = mongoose.model('Patent');
// controllers for patent


var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// TODO: implement filtering

module.exports.listAllPatents = function(req, res){
	
	// retrieve all patent applications
	Patent
		.find()
		.exec(function(err, patent){
			if(err){
				sendJsonResponse(res, err, 404);	
			} else {
				sendJsonResponse(res, patent, 200);
			}
		});
};

module.exports.listOnePatent = function(req, res){
	
	// find patent by patent id
	if(req.params && req.params.patentid && mongoose.Types.ObjectId.isValid(req.params.patentid)){
		Patent
			.findById(req.params.patentid)
			.exec(function(err, patent){
				if(err){
					sendJsonResponse(res, err, 400);
				}
				else if(!patent){
					sendJsonResponse(res, "no such patent", 404);	
				} else {
					sendJsonResponse(res, patent, 200);
				}
			});
	} else {
		sendJsonResponse(res, "Invalid/NonExistent patentId", 404);	
	}
};

module.exports.createPatent = function(req, res){
	
	Patent.create({
		clientId: req.body.clientid,
		clientDocketNumber: req.body.clientdocketnumber,
		country: req.body.country,
		applicationType: req.body.applicationtype,
		filingDate: req.body.filingdate,
		filingNumber: req.body.filingnumber,
		englishTitle: req.body.englishtitle,
		chineseTitle: req.body.chinesetitle,
		priority: {
			priorityCountry: req.body.prioritycountry,
			priorityFilingNumber: req.body.priorityfilingnumber,
			priorityDate: req.body.prioritydate
		},
		active: true
	}, function(err, patent){
		if(err){
			sendJsonResponse(res, err, 400);	
		} else {
			sendJsonResponse(res, patent, 200);	
		}
	});
};

module.exports.updatePatent = function(req, res){
	
	
	
};

module.exports.deletePatent = function(req, res){
	
	
	
};

