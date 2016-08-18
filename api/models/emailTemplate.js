var mongoose = require('mongoose');
var format = require("string-template")

var emailTemplateSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
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
  var content = format(this.content, patent);
  var url = 'http://mail.google.com/mail/u/0/?compose=1&view=cm&fs=1&tf=1'
              + '&su='
              + encodeURIComponent(subject)
              + '&body='
              + encodeURIComponent(content);
  return url;
}

mongoose.model('emailTemplate', emailTemplateSchema);
