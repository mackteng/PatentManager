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
		clientId: req.body.clientId,
		clientDocketNumber: req.body.clientDocketNumber,
		country: req.body.country,
		applicationType: req.body.applicationType,
		filingDate: req.body.filingDate,
		filingNumber: req.body.filingNumber,
		englishTitle: req.body.englishTitle,
		chineseTitle: req.body.chineseTitle,
		priority: {
			priorityCountry: req.body.priorityCountry,
			priorityFilingNumber: req.body.priorityFilingNumber,
			priorityDate: req.body.priorityDate
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

/**

	Update fields in an existing patent application

	PUT /api/patents/:patentid

**/

module.exports.updatePatent = function(req, res){

	if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No Such Patent Found", 404);
	}

	Patent
		.findById(req.params.patentid)
		.exec(function(err, patent){

			if(err){
				return sendJsonResponse(res, err, 400);
			}
		
			if(!patent){
				return sendJsonReponse(res, "No Such Patent Found");
			}

			for(var field in Patent.schema.paths){
				if(field != '_id' && field != '_v'){
					if(req.body[field]){
						patent[field] = req.body[field];
					}
				}
			
			}

			patent.save(function(err){
				if(err){
					return sendJsonResponse(res, err, 400);
				}
				sendJsonResponse(res, patent, 200);
			});

		});
};

module.exports.deletePatent = function(req, res){
	
	
	
};

