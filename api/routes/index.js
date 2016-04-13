var express = require('express');
var router = express.Router();

// require controllers

var patentController = require('../controllers/patentController.js');
var clientController = require('../controllers/clientController.js');

// define api routes for patent

router.get('/patents', patentController.listAllPatents);
router.get('/patents/:patentid', patentController.listOnePatent);
router.post('/patents', patentController.createPatent);
router.put('/patents/:patentid', patentController.updatePatent);
router.delete('/patents/:patentid', patentController.deletePatent);

// define api routes for client
router.get('/clients', clientController.listAllClients);
router.post('/clients', clientController.createClient);
router.put('/clients/:clientid/contacts', clientController.addContacts);
router.put('/clients/:clientid', clientController.updateClient);
router.delete('/clients', clientController.deleteClient);


module.exports = router;

