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
    .select('eventHistory')
    .exec(function(err, patent){
      if(err){
        return sendJsonResponse(res, err, 400);
      }
      EventHistory
        .findById(patent.eventHistory)
        .exec(function(err, eventHistory){
            if(err){
              return sendJsonResponse(res, err, 400);
            }
            sendJsonResponse(res, eventHistory.eventHistory, 200);
        });
    });
};

// add Event to Event History Container
module.exports.addEvent = function(req, res){
  if(!req.params || !res.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}




};

// delete Event from Event History Container
module.exports.deleteEvent = function(req, res){
  if(!req.params || !res.params.patentid || !mongoose.Types.ObjectId.isValid(req.params.patentid)){
		return sendJsonResponse(res, "No PatentId Specified", 400);
	}




};
