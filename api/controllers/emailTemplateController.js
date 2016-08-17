var mongoose = require('mongoose');
var EmailTemplate = mongoose.model('emailTemplate');
var Patent = mongoose.model('Patent');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// must specify patent ID and template ID
module.exports.populateEmailTemplate = function(req,res){
  if(!req.params || !req.params.emailtemplateid || req.params.patentid){
    return sendJsonResponse(res, 400, 'Invalid Request');
  }

  EmailTemplate
    .findById(req.params.emailtemplateid)
    .exec(function(err, emailTemplate){
      if(err){
        return sendJsonResponse(res, err, 400);
      }
      Patent
        .findById(req.params.patentid)
        .exec(function(err, patent){
          if(err){
            return sendJsonResponse(res, err, 400);
          }
          res.redirect(301, emailTemplate.populateTemplate(patent));
        });
    });
}

// only returns the ids
module.exports.listAllEmailTemplates = function(req,res){
  EmailTemplate
    .find()
    .populate('_id')
    .exec(function(err, ids){
      if(err){
        return sendJsonResponse(res, err, 400);
      }
      return sendJsonResponse(res, ids, 200);
    });
}

module.exports.addEmailTemplate = function(req,res){
  var emailTemplate = {
    subject: req.body.subject,
    content: req.body.content
  }
  EmailTemplate.create(emailTemplate, function(err, template){
      if(err){
        return sendJsonResponse(res,err,400);
      }
      return sendJsonResponse(res,null,200);
  });
}

module.exports.updateEmailTemplate = function(req,res){
  if(!req.params || !req.params.emailtemplateid){
    return sendJsonResponse(res, 400, 'Invalid Request');
  }
  EmailTemplate
    .findById(req.params.emailtemplateid)
    .exec(function(err, emailTemplate){
      if(err){
        return sendJsonResponse(res,err,400);
      }
      if(!emailTemplate){
        return sendJsonResponse(res,"No Such Template Found",404);
      }
      emailTemplate.subject = req.body.subject;
      emailTemplate.content = req.body.content;

      emailTemplate.save(function(err){
        if(err){
          return sendJsonResponse(res,err,400);
        }
        return sendJsonResponse(res,null,200);
      });
    });
}

module.exports.deleteEmailTemplate = function(req,res){
  if(!req.params || !req.params.emailtemplateid){
    return sendJsonResponse(res, 400, 'Invalid Request');
  }
  EmailTemplate
    .findByIdAndRemove(req.params.emailtemplateid, function(err){
        if(err){
          return sendJsonResponse(res, 400, err);
        }
        sendJsonResponse(res,null,204);
    });
}
