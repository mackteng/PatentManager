require('dotenv').load();
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var schedule = require('node-schedule');
var table = {};

var generateEmailFunction = function(event, emailAddress){
  return function(){
    var helper = require('sendgrid').mail
    var date = new Date(event.eventDeadline);
    var from_email = new helper.Email("service@litron-intl.com");
    var to_email = new helper.Email(emailAddress);
    var subject = "This is a reminder that the deadline : " + event.eventName + " is approaching on : " + new Date(event.eventDeadline);
    var content = new helper.Content("text/plain", event.eventNote);
    var mail = new helper.Mail(from_email,subject,to_email,content);
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var requestBody = mail.toJSON();
    var request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    sg.API(request, function (err,response) {
      if(err){
        console.log(err);
      }
    });
  }
}

var scheduleEvent = function(event){
  console.log(event);
  if(!event.completed){
    if(!table[event._id]){
      table[event._id] = [];
    }
    for(var j = 0; j < event.notificationDates.length; j++){
      for(var k = 0; k < event.notificationEmails.length; k++){
        console.log('Scheduling Job For Event ' + event._id + ' for ' + event.notificationEmails[k] + ' on ' + event.notificationDates[j]);
        var job = schedule.scheduleJob(new Date(event.notificationDates[j]), function(){
          generateEmailFunction(event, event.notificationEmails[k])();
        });
        table[event._id].push(job);
      }
    }
  }
}

var populateTable = function(){
  Event
    .find()
    .exec(function(err,events){
      if(err){
        console.log(err);
        return;
      }
      for(var i = 0; i < events.length; i++){
        scheduleEvent(events[i]);
      }
    });
};

module.exports.updatePatent = function(eventid){




}

module.exports.deleteEvent = function(eventid){
  if(table[eventid]){
    for(var i = 0; i < eventid; i++){
      table[eventid].cancel();
    }
    delete table[eventid];
  }
}


populateTable();
