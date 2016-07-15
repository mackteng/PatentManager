var mongoose = require('mongoose');
var Patent = mongoose.model('Patent');
var EventHistory = mongoose.model('EventHistory');
var Event = mongoose.model('Event');

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
		.select('eventHistory lastEvent')
		.exec(function(err, patent){
				if(err) return sendJsonResponse(res, err, 400);
				var event = new Event({
					eventName : req.body.eventName,
					eventDeadline : req.body.eventDeadline,
					eventNote: req.body.eventNote
				});
				if(event.eventDeadline) patent.lastDeadline = event;
				patent.eventHistory.eventHistory.unshift(event);
				patent.eventHistory.save(function(err, history){
					if(err) return sendJsonResponse(res, err, 400);
				});
				patent.save(function(err, history){
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
			history.splice(0,1);
			patent.eventHistory.save(function(err, history){
					if(err) return sendJsonResponse(res, err, 400);
					sendJsonResponse(res, history, 200);
			});
		});
};
