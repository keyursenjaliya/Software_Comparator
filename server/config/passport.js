var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
    // passport init setup
    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // using local strategy
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        if (email) {
            email = email.toLowerCase();
        }

        process.nextTick(function () {
            User.findOne({ 'local.email': email }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
                } else {
                    return done(null, user);
                }
            });
        });
    }));

    // Signup local strategy
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        if (email) {
            email = email.toLowerCase();
        }

        // asynchronous
        process.nextTick(function () {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Wohh! the email is already taken.'));
                    } else {
                        var newUser = new User();

                        if (!(req.body.firstName.trim() && req.body.lastName.trim() &&
                             req.body.username.trim() && req.body.city.trim() &&
                             req.body.country.trim() && req.body.state.trim() &&
                             req.body.phone.trim() && req.body.role.trim())) {
                            return done(null, false, req.flash('signupMessage', 'Wohh! All fields are required.'));
                        }

                        if (password.length < 6) {
                            return done(null, false, req.flash('signupMessage', 'Wohh! Password length should be atleast 6.'));
                        }

                        if (isNaN(req.body.phone)) {
                            return done(null, false, req.flash('signupMessage', 'Wohh! Phone number should be a number'));
                        } else if (req.body.phone.length != 10 ) {
                            return done(null, false, req.flash('signupMessage', 'Wohh! Phone number should be of 10 digits'));
                        }

                        newUser.local.firstName = req.body.firstName;
                        newUser.local.lastName = req.body.lastName;
                        newUser.local.username = req.body.username;
                        newUser.local.city = req.body.city;
                        newUser.local.country = req.body.country;
                        newUser.local.state = req.body.state;
                        newUser.local.phone = req.body.phone;
                        newUser.role = req.body.role;

                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                });
            } else {
                return done(null, req.user);
            }
        });
    }));
};
