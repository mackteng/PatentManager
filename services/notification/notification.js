require('dotenv').load();
var mongoose = require('mongoose');
var Email = mongoose.model('Email');
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

var populateTable = function(){
  Email
    .find()
    .exec(function(err,emails){
      if(!err){
          console.log(emails);
      }
    });
};
populateTable();
module.exports.scheduleEventNotification = function(event,emailAddress){
  var email = new Email({
    notifyEvent : event,
    emailAddress: emailAddress
  });
  email.save(function(err,email){
    if(!err){
      // schedule le job
      var job = schedule.scheduleJob(new Date(email.eventDeadline), function(){
        // send off the email
        generateEmailFunction(event,emailAddress)();
        // if last email in notification queue, delete email from database and in-memory table


      });
      // store in in-memory table for easy reference
      if(!table['email.eventID']){
        table[email.eventId] = [];
      }
      table[email.eventId].push(job);
    }
  });
};

module.exports.rescheduleEventNotification = function(newEvent, oldEventId){

}

module.exports.cancelEventNotification = function(eventID){
  Email
		.findByIdAndRemove(eventID, function(err){
				if(!err){
					for(var i = 0; i < table[eventID].length; i++){
            table[eventID][i].cancel();
          }
          delete table[eventID];
				}
		});
}
