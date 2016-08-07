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
				if(!user || !user.admin){
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
router.post('/patents', auth, userExists,patentController.createPatent);
router.put('/patents/:patentid', auth, userExists,patentController.updatePatent);
router.delete('/patents/:patentid', auth, userExists, isAdmin, patentController.deletePatent);

// define api routes for event history
router.get('/patents/:patentid/events', auth, userExists,eventController.getEventHistory);
router.post('/patents/:patentid/events', auth, userExists,eventController.addEvent);

router.get('/events', auth, userExists, eventController.listAllEvents);
router.delete('/events/:eventid', auth, userExists, eventController.deleteEvent);


// Returns a listing of all clients
router.get('/clients', auth, userExists, clientController.listAllClients);
// Create a new client
router.post('/clients', auth, userExists, isAdmin,clientController.createClient);
// Update an existing client
router.put('/clients/:clientid', auth, userExists, isAdmin,clientController.updateClient);
// Delete an existing client
router.delete('/clients', auth, userExists, isAdmin, clientController.deleteClient);

module.exports = router;
