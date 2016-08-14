var mongoose = require('mongoose');
var Patent = mongoose.model('Patent');
var Event = mongoose.model('Event');
var notification = require('../../services/notification/notification.js');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// retrieve all events
module.exports.listAllEvents = function(req, res){
	Event
		.find()
		.exec(function(err,events){
			if(err){
				return sendJsonResponse(res, err, 400);
			}
			return sendJsonResponse(res, events, 200);
		});
	}


// retrieve all events for given patentID
module.exports.getEventHistory = function(req, res){
  if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
    return sendJsonResponse(res, "No PatentId Specified", 400);
  }
  Event
    .find({
			patentID: req.params.patentid
		})
    .exec(function(err, events){
			console.log(err);
      if(err) return sendJsonResponse(res, err, 400);
			if(!events) return sendJsonResponse(res, [], 404);
      sendJsonResponse(res, events, 200);
    });
};

// add Event to Event History Container
module.exports.addEvent = function(req, res){
  if(!req.params || !req.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}

	var newEvent = new Event({
			patentID : req.params.patentid,
			eventName : req.body.eventName,
			eventDeadline : req.body.eventDeadline,
			eventNote: req.body.eventNote,
			notificationEmails: req.body.notificationEmails,
			notificationDates: req.body.notificationDates,
			completed: false
	});

	newEvent.save(function(err, event){
		if(err) return sendJsonResponse(res,err,400);
		notification.addEvent(event);
		sendJsonResponse(res, event, 200);
	});
};

// delete Event from Event History Container
module.exports.deleteEvent = function(req, res){
  if(!req.params || !req.params.eventid || !mongoose.Types.ObjectId.isValid(req.params.eventid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}

	Event
	.findByIdAndRemove(req.params.eventid, function(err){
		if(err){
			return sendJsonResponse(res, 400, err);
		}
		sendJsonResponse(res,null,204);
	});
};
