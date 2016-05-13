var mongoose = require('mongoose');
var Patent = mongoose.model('Patent');
var EventHistory = mongoose.model('EventHistory');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// retrieve Event History Container
module.exports.getEventHistory = function(req, res){
  if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
    return sendJsonResponse(res, "No PatentId Specified", 400);
  }
  Patent
    .findById(req.params.patentid)
		.populate('eventHistory')
    .select('eventHistory')
    .exec(function(err, patent){
      if(err) return sendJsonResponse(res, err, 400);
      sendJsonResponse(res, patent.eventHistory, 200);
    });
};

// add Event to Event History Container
module.exports.addEvent = function(req, res){
  if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}
	Patent
		.findById(req.params.patentid)
		.populate('eventHistory')
		.select('eventHistory')
		.exec(function(err, patent){
				if(err) return sendJsonResponse(res, err, 400);
				patent.eventHistory.eventHistory.push(req.body.event);
				patent.eventHistory.save(function(err, history){
							if(err) return sendJsonResponse(res, err, 400);
							sendJsonResponse(res, history, 200);
						})
				});
};

// delete Event from Event History Container
module.exports.deleteEvent = function(req, res){
  if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}

	PatentId
		.findById(req.params.patentid)
		.populate('eventHistory')
		.select('eventHistory')
		.exec(function(err, patent){
			if(err) return sendJsonResponse(res, err, 400);
			var history = patent.eventHistory.eventHistory;
			history.splice(history.indexOf(req.body.event), 1);
			patent.eventHistory.save(function(err, history){
					if(err) return sendJsonResponse(res, err, 400);
					sendJsonResponse(res, history, 200);
			});
		});
};
