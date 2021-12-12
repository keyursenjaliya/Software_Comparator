var Software = require('../models/software');
var xss = require('xss')

exports.listSoftwares = function (req, res) {
    Software.find().exec(function (error, softwares) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }

        res.render('vendor', {
            title: 'Vendor Page',
            softwares: softwares,
        });
    });
};

exports.createSoftware = function (req, res) {
    var newSoftware = new Software();

    if (!(req.body.name && req.body.catagory && req.body.details &&
        req.body.subscriptionPrice && req.body.developerName)) {
        return res.redirect('/vendor');
    }

    newSoftware.name = req.body.name;
    newSoftware.catagory = req.body.catagory;
    newSoftware.details = req.body.details;
    newSoftware.developerName = req.body.developerName;
    newSoftware.subscriptionPrice = req.body.subscriptionPrice;

    newSoftware.save(function (error) {
        return res.redirect('/vendor');
    });
};

exports.deleteSoftware = function (req, res) {
    var id = xss(req.query.deleteSoftwareId);

    Software.findOne({ _id: id }).remove(function (error) {
        return res.redirect('/vendor');
    });
};

exports.updateSoftwarae = function (req, res) {
    var id = req.body.updateSoftwareId;

    if (!(req.body.name && req.body.catagory && req.body.details &&
        req.body.subscriptionPrice && req.body.developerName)) {
        return res.redirect('/vendor');
    }

    Software.findOneAndUpdate({ _id: id }, {
        name: req.body.name,
        developerName: req.body.developerName,
        subscriptionPrice: req.body.subscriptionPrice,
        catagory: req.body.catagory,
        details: req.body.details
    }, function (errr, data) {
        return res.redirect('/vendor');
    });
};

exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 0) {
            return next();
        } else {
            res.redirect('/profile');
        }
    }

    res.redirect('/login');
};