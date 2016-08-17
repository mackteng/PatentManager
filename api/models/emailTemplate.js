var mongoose = require('mongoose');
var format = require("string-template")

var emailTemplateSchema = new mongoose.Schema({
  subject:{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  }
});

emailTemplateSchema.methods.populateTemplate = function(patent){
  var subject = format(this.subject, patent);
  var content = format(this.subject, patent);
  return 'https://mail.google.com/mail/u/0/?compose=1&view=cm&fs=1&tf=1' + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(content);
}

mongoose.model('emailTemplate', emailTemplateSchema);
