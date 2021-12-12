var express = require('express');
var router = express.Router();

var commentsController = require('../controllers/commentsController');

router.post('/', commentsController.hasAuthorization,
    commentsController.create);

module.exports = router;