var express = require('express');
var router = express.Router();
var passport = require('passport');
var gravatar = require('gravatar');
var User = require('../models/user')

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('main', {
		title: 'Welcome to software suggestion'
	});
});

/* GET login page. */
router.get('/login', function (req, res, next) {
	if  (req.isAuthenticated()) {
		if (req.user.role == 1) {
			res.redirect('/profile');
		} else {
			res.redirect('/vendor');
		}
	}

	res.render('login', {
		title: 'Login Page',
		message: req.flash('loginMessage')
	});
});

/* POST login */
router.post('/login', passport.authenticate('local-login', {
	failureRedirect: '/login',
	failureFlash: true
}), function (req, res) {
	User.findOne({ email: req.user.email }, function (err, user) {
		if (err) {
			res.redirect('/login');
			return;
		}

		if (user.role == 1) {
			res.redirect('/profile');
		} else {
			res.redirect('/vendor');
		}
	});
});

/* GET Signup */
router.get('/signup', function (req, res) {
	res.render('signup', {
		title: 'Signup Page',
		message: req.flash('signupMessage')
	});
});

/* POST Signup */
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/signup',
	failureFlash: true
}));

/* GET Profile page. */
router.get('/profile', isLoggedIn, function (req, res, next) {
	res.render('profile', {
		title: 'Profile Page',
		user: req.user,
		avatar: gravatar.url(req.user.email, {
			s: '100', r: 'x', d: 'retro'
		}, true)
	});
});

/* GET Logout Page */
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

/* check if user is logged in */
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

module.exports = router;
