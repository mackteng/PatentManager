var schedule = require('node-schedule');
var generateEmailFunction = function(event, emailAddress){
  return function(){
    var helper = require('sendgrid').mail
    from_email = new helper.Email("service@litron-intl.com");
    to_email = new helper.Email(emailAddress);
    subject = "This is a reminder that the deadline : " + event.eventName + "is approaching on : " + new Date(event.eventDeadline);
    content = new helper.Content("text/plain", event.note);
    mail = new helper.Mail(from_email,subject,to_email,content);
    var sg = require('sendgrid')("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");
    var requestBody = mail.toJSON();
    var request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    sg.API(request, function (err,response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
  }
}

testEvent = {
  eventName : 'Test',
  eventDeadline : new Date(),
  note : 'asdfasdfasdfadf'
}

generateEmailFunction(testEvent, 'mackteng@litron-intl.com')();
