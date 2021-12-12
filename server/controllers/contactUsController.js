var ContactUs = require('../models/contactUs');
var mongoose = require('mongoose');
var gravatar = require('gravatar');

// List top rated softwares
exports.getContactUsPage = function (req, res) {
    res.render('contactUs', {
        title: 'Contact Us',
    });
};

exports.createQuery = function (req, res) {
    var query = new ContactUs();

    query.name = req.body.name;
    query.email = req.body.email;
    query.message = req.body.message;

    query.save(function(err, data) {
        res.send(200, {
            created: true
        })
    });
};

