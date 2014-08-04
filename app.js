/**
 * Module dependencies.
 */

var express        = require('express'),
    path           = require('path'),
    fs             = require('fs'),
    favicon        = require('static-favicon'),
    logger         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    session        = require('express-session'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    sass           = require('node-sass');

var debug = require('debug')('huboter');
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config')[env];


// Connect database
require('./config/db')(mongoose, config);


// Bootstrap models and inject dependencies
var hubotUtils = require('./lib/hubot');
var fakeHubotUtils = require('./test/mocks').hubotUtilsMock;
// env NOHUBOT=true to avoid interacting with Hubot
if (process.env.NOHUBOT === 'true') hubotUtils = fakeHubotUtils
var UserSchema = require('./models/user')();
var BotSchema = require('./models/bot')(hubotUtils);
mongoose.model('User', UserSchema);
mongoose.model('Bot', BotSchema);


/**
 * CREATE APP AND ATTACH MIDDLEWARES
 */
var app = express();

// set environment
app.set('env', env);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//// app.use(csrf());
app.use(methodOverride());
app.use(cookieParser('HU80T3Rsecrettoken'));
app.use(session({
  secret: 'HU80T3Rsecrettoken'
}));

// static assets
app.use(sass.middleware({
  src: __dirname + '/public/sass',
  dest: __dirname + '/public/stylesheets',
  prefix: '/stylesheets',
  debug: true,
  includePaths: ['public/vendor/bootstrap-sass/stylesheets/'],
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));

// passportjs authentication using
// session and local strategy
var auth = require('./config/auth');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser);
passport.use(auth.passportStrategy);



/**
 * ATTACH MAIN ROUTER - config/router.js
 */
require('./config/router')(app);


/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/**
 * ERROR HANDLERS
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
