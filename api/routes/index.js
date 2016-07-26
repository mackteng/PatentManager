var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var express = require('express');
var router = express.Router();

// require controllers

var patentController = require('../controllers/patentController.js');
var clientController = require('../controllers/clientController.js');
var eventController  = require('../controllers/eventController.js');
var authController = require('../controllers/authController.js');


router.post('/register', authController.register);
router.post('/login', authController.login);

// define api routes for patent
router.get('/patents', patentController.listAllPatents);
router.get('/patents/:patentid', patentController.listOnePatent);
router.post('/patents', patentController.createPatent);
router.put('/patents/:patentid', patentController.updatePatent);
router.delete('/patents/:patentid', auth, patentController.deletePatent);

// define api routes for event history
router.get('/patents/:patentid/events', eventController.getEventHistory);
router.post('/patents/:patentid/events', eventController.addEvent);
router.delete('/patents/:patentid/events', auth, eventController.deleteEvent);


// Returns a listing of all clients
router.get('/clients', clientController.listAllClients);
// Create a new client
router.post('/clients', clientController.createClient);
// Update an existing client
router.put('/clients/:clientid', clientController.updateClient);
// Delete an existing client
router.delete('/clients', clientController.deleteClient);

module.exports = router;
