var express = require('express');
var router = express.Router();

var vendorController = require('../controllers/vendorController');

router.get('/', vendorController.hasAuthorization,
    vendorController.listSoftwares);

router.post('/', vendorController.hasAuthorization,
    vendorController.createSoftware);

router.post('/edit', vendorController.hasAuthorization,
    vendorController.updateSoftwarae);

router.get('/delete', vendorController.hasAuthorization,
    vendorController.deleteSoftware);

module.exports = router;
