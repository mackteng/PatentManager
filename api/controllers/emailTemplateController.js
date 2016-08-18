var mongoose = require('mongoose');
var EmailTemplate = mongoose.model('emailTemplate');
var Patent = mongoose.model('Patent');
var format = require('string-template');

var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// must specify patent ID and template ID
module.exports.populateEmailTemplate = function(req,res){
  if(!req.params || !req.params.emailtemplateid || !req.params.patentid){
    return sendJsonResponse(res, 'Invalid Request', 400);
  }

  EmailTemplate
    .findById(req.params.emailtemplateid)
    .exec(function(err, emailTemplate){
      if(err){
        return sendJsonResponse(res, err, 400);
      }
      Patent
        .findById(req.params.patentid)
				.populate('clientId')
        .exec(function(err, patent){
          if(err){
            return sendJsonResponse(res, err, 400);
          }
					date = new Date();
					patent.clientNumber = patent.clientId._id;
					patent.clientChineseName = patent.clientId.chineseName;
					patent.clientEnglishName = patent.clientId.englishName;
					patent.clientChineseAddress = patent.clientId.chineseAddress;
					patent.clientEnglishAddress = patent.clientId.EnglishAddress;
					patent.clientTelephone = patent.clientId.telephone;
					patent.clientRepChineseName = patent.clientId.repChineseName;
					patent.clientRepEnglishName = patent.clientId.repEnglishName;

					patent.date = date.getDate();
					patent.month = date.getMonth();
					patent.fullDate = date.getDate()+'/'+(1+date.getMonth())+'/'+date.getFullYear();
          res.redirect(emailTemplate.populateTemplate(patent));
        });
    });
}

// only returns the ids
module.exports.listAllEmailTemplates = function(req,res){
  EmailTemplate
    .find()
    .exec(function(err, ids){
      if(err){
        return sendJsonResponse(res, err, 400);
      }
      return sendJsonResponse(res, ids, 200);
    });
}

module.exports.addEmailTemplate = function(req,res){
  var emailTemplate = {
		name: req.body.name,
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
			emailTemplate.name = req.body.name;
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
