var express = require('express');
var router = express.Router();

var softwareController = require('../controllers/softwareController');

router.get('/', softwareController.hasAuthorization,
    softwareController.listTopItems);

router.get('/search', softwareController.hasAuthorization,
    softwareController.searchSoftware);

router.get('/compare', softwareController.hasAuthorization,
    softwareController.compareSoftware);

router.get('/:id', softwareController.hasAuthorization,
    softwareController.getSoftwareById);

module.exports = router;
