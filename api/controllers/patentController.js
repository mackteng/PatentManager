var mongoose = require('mongoose');
var Patent = mongoose.model('Patent');
var EventHistory = mongoose.model('EventHistory');
var User = mongoose.model('User');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// TODO: implement filtering

module.exports.listAllPatents = function(req, res){

	// retrieve all patent applications
	Patent
		.find()
		.populate('eventHistory')
		.exec(function(err, patent){
			if(err){
				return sendJsonResponse(res, err, 404);
			}
			sendJsonResponse(res, patent, 200);
		});
};

module.exports.listOnePatent = function(req, res){

	if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}

	Patent
		.findById(req.params.patentid)
		.exec(function(err, patent){
			if(err){
				return sendJsonResponse(res, err, 400);
			}
			if(!patent){
				return sendJsonResponse(res, "no such patent", 404);
			}
			sendJsonResponse(res, patent, 200);
		});
};

module.exports.createPatent = function(req, res){

	var patent = {
		clientId: req.body.clientId,
		docketNumber: req.body.docketNumber,
		clientDocketNumber: req.body.clientDocketNumber,
		country: req.body.country,
		applicationType: req.body.applicationType,
		filingDate: req.body.filingDate,
		filingNumber: req.body.filingNumber,
		englishTitle: req.body.englishTitle,
		chineseTitle: req.body.chineseTitle,
		inventors: req.body.inventors,
		active: true,
		comments:[]
	};

	if(req.body.priority){
		patent.priority = {
			priorityCountry: req.body.priority.priorityCountry,
			priorityFilingNumber: req.body.priority.priorityFilingNumber,
			priorityDate: req.body.priority.priorityDate
		};
	}
	Patent.create(patent, function(err, patent){
		if(err){
			return sendJsonResponse(res, err, 400);
		}
		var newEventHistory = new EventHistory({patentId : patent._id});

		newEventHistory.save(function(err, eventHistory){
				if(err){
					return sendJsonResponse(res, err, 400);
				}
				patent.eventHistory = eventHistory._id;
				patent.save(function(err, patent){
					if(err){
						return sendJsonResponse(res, err, 400);
					}
					sendJsonResponse(res, patent, 200);
				});
		});
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

/* deletes a patent from the database
 * Must be an admin to access this function
 *
 */
var doDeletePatent = function(req, res, patentid){
	if(!patentid){
		return sendJsonResponse(res, 404, 'Patent Not Found');
	}
	Patent
		.findByIdAndRemove(patentid, function(err){
				if(err){
					return sendJsonResponse(res, 400, err);
				}
				sendJsonResponse(res,204,null);
		});
}
module.exports.deletePatent = function(req, res){
	if(!req.payload || !req.payload.email){
		return sendJsonResponse(res, 401, 'Not Authorized');
	}

	User
		.findOne({email: req.payload.email})
		.exec(function(err,user){
				if(err || !user){
					return sendJsonResponse(res, 400, err);
				}
				if(!user.admin){
					return sendJsonResponse(res, 401, 'Not Authorized');
				}
				doDeletePatent(req.params.patentid);
		});
};
