var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var Patent = mongoose.model('Patent');
var Docxtemplater = require('docxtemplater');


var sendJsonResponse = function(res, payload, status){
	res.status(status);
	res.json(payload);
}

// must specify patent ID and template ID
module.exports.populateInvoiceTemplate = function(req,res){
  if(!req.params || !req.params.invoicename || !req.params.patentid){
    return sendJsonResponse(res,'Invalid Request', 400);
  }
	Patent
		.findById(req.params.patentid)
		.populate('clientId')
		.exec(function(err, patent){
			console.log(patent);
			if(err){
				return sendJsonResponse(res, err, 400);
			}
			if(!patent){
				return sendJsonResponse(res, "No Such Patent Found", 404);
			}
			fs.readFile(__dirname+'/../../uploads/' + req.params.invoicename, function(err,content){
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
				try{
					var doc = new Docxtemplater(content);
					doc.setData(patent);
					doc.render();
					var buf = doc.getZip().generate({type:"nodebuffer"});
					fs.writeFileSync(__dirname+"/output.docx",buf);
					res.download(__dirname+"/output.docx", 'invoice.docx', function(err){
						fs.unlinkSync(__dirname+"/output.docx");
					});
				} catch(err){
					return sendJsonResponse(res, err.message, 400);
				}
			});
		});
};

// only returns the ids
module.exports.listAllInvoiceTemplates = function(req,res){
  fs.readdir(path.join(__dirname,'../../uploads'), function(err, files){
      if(err){
        return sendJsonResponse(res,err,400);
      }
      return sendJsonResponse(res,files,200);
  });
};

module.exports.addInvoiceTemplate = function(req,res){
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../uploads/');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
};

module.exports.deleteInvoiceTemplate = function(req,res){
  if(!req.params || !req.params.Invoicetemplateid){
    return sendJsonResponse(res, 'Invalid Request', 400);
  }
};
