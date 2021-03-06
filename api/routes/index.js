var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

// require controllers

var patentController = require('../controllers/patentController.js');
var clientController = require('../controllers/clientController.js');
var eventController  = require('../controllers/eventController.js');
var authController = require('../controllers/authController.js');
var emailTemplateController = require('../controllers/emailTemplateController.js');
var invoiceTemplateController = require('../controllers/invoiceTemplateController.js');


var userExists = function(req,res,next){
  if(!req.payload || !req.payload.email){
    next(new Error('400 Invalid Request'));
  }
  User
		.findOne({email: req.payload.email})
		.exec(function(err,user){
				if(err){
					next(err);
				}
				if(!user){
					next(new Error('401 Not Authorized'));
				}
        req.user = user;
				next();
		});
}

var isAdmin = function(req,res,next){
  if(!req.user.admin){
    next(new Error('401 Not Authorized (Requires Administrator Priviliges)'));
  }
  next();
}

router.post('/register', authController.register);
router.post('/login', authController.login);

// define api routes for patent
router.get('/patents', auth, userExists, patentController.listAllPatents);
router.get('/patents/:patentid', auth, userExists, patentController.listOnePatent);
router.post('/patents', patentController.createPatent);
router.put('/patents/:patentid', auth, userExists,patentController.updatePatent);
router.delete('/patents/:patentid', auth, userExists, isAdmin, patentController.deletePatent);

// define api routes for events
router.get('/patents/:patentid/events', auth, userExists,eventController.getEventHistory);
router.post('/patents/:patentid/events', auth, userExists,eventController.addEvent);
router.delete('/patents/:patentid/events', auth, userExists,eventController.deleteEventHistory);

router.get('/events', auth, userExists, eventController.listAllEvents);
router.put('/events/:eventid', auth, userExists, eventController.updateEvent);
router.delete('/events/:eventid', auth, userExists, eventController.deleteEvent);


// define api routes for clients
router.get('/clients', auth, userExists, clientController.listAllClients);
router.post('/clients', auth, userExists, isAdmin,clientController.createClient);
router.put('/clients/:clientid', auth, userExists, isAdmin,clientController.updateClient);
router.delete('/clients', auth, userExists, isAdmin, clientController.deleteClient);

// define api routes for email templates
router.get('/patents/:patentid/email/:emailtemplateid', emailTemplateController.populateEmailTemplate);
router.get('/emailTemplates', emailTemplateController.listAllEmailTemplates);
router.post('/emailTemplates', emailTemplateController.addEmailTemplate);
router.put('/emailTemplates/email/:emailtemplateid', emailTemplateController.updateEmailTemplate);
router.delete('/emailTemplates/email/:emailtemplateid', emailTemplateController.deleteEmailTemplate);

// define api routes for invoice templates
router.get('/patents/:patentid/invoice/:invoicename', invoiceTemplateController.populateInvoiceTemplate);
router.get('/invoices', invoiceTemplateController.listAllInvoiceTemplates);
router.post('/invoices', invoiceTemplateController.addInvoiceTemplate);
router.delete('/invoices/:invoicename', invoiceTemplateController.deleteInvoiceTemplate);


module.exports = router;
