var express = require('express');
var router = express.Router();

var contactUsController = require('../controllers/contactUsController');

router.get('/', contactUsController.getContactUsPage);

router.post('/', contactUsController.createQuery);

module.exports = router;
