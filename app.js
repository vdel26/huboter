/**
 * Module dependencies.
 */

var express        = require('express'),
    path           = require('path'),
    fs             = require('fs'),
    favicon        = require('static-favicon'),
    logger         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose');

var debug = require('debug')('huboter');
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config')[env];

/**
 * DB CONNECTION
 */
// connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect(config.db, options);
  debug('db connected ok');
}
connect();

// error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
  debug('db connection error');
});

// reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

// Bootstrap models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});


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
// app.use(csrf());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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
