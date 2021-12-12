var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
const Handlebars = require('handlebars');

// We are using handlebase view engine
var exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

var hbs = exphbs.create({
	layoutsDir: path.join(__dirname, 'server/views/pages'),
	partialsDir: [
		//  path to your partials
		path.join(__dirname, 'server/views/partials'),
	],
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	helpers: {
		inc: function (value, options) {
			return parseInt(value) + 1;
		},
		setVar: function (varName, varValue, options) {
			options.data.root[varName] = varValue;
		},
		roundDecimal: function (value, options) {
			var with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
			return with2Decimals;
		}
	}
});

var app = express();

// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'server/views/pages');
app.locals.layout = false;

var dbConfig = require('./server/config/config.js');
mongoose.connect(dbConfig.url);
mongoose.connection.on('error', function () {
	console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

// Passport configuration
require('./server/config/passport')(passport);

// required for passport secret for session
app.use(session({
	secret: 'my-secret-text',
	saveUninitialized: true,
	resave: true,
	//store session on MongoDB using express-session + connect mongo,
	store: MongoStore.create({
		mongoUrl: dbConfig.url,
		collectionName: 'sessions'
	}),
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());


// Global variable to check loggedin or not
app.use(function (req, res, next) {
	app.locals.isLoggedIn = req.isAuthenticated();

	if (app.locals.isLoggedIn) {
		app.locals.userName = req.user.local.username;
		app.locals.isVendor = req.user.role == 0;
	}
	next();
});

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Our Routes
var indexRouter = require('./server/routes/index');
var commentsRouter = require('./server/routes/comments');
var softwareRouter = require('./server/routes/softwares');
var vendorRouter = require('./server/routes/vendor');
var contactUsRouter = require('./server/routes/contactUs');

// Our Paths
app.use('/', indexRouter);
app.use('/comments', commentsRouter);
app.use('/softwares', softwareRouter);
app.use('/vendor', vendorRouter);
app.use('/contactUs', contactUsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler for errors other than 404
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Set the port
app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;