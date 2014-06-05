var express  = require('express'),
    mongoose = require('mongoose'),
    debug    = require('debug')('route:users');


/* routes with basePath /users */
var users = express.Router();

/* Model */
var User = mongoose.model('User');


/**
 * INDEX – GET /user - get all users
 */
function index (req, res) {
  User.find({}).populate('bots').exec(function (err, results) {
    if (err) return debug('ERROR');

    res.format({
      json: function () {
        res.json({ users: results });
      },
      html: function () {
        res.render('users/index', { users: results });
      }
    });
  });
}

/**
 * SHOW – GET /user - see one user
 */
function show (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) return debug('ERROR');

    res.format({
      json: function () {
        res.json({ user: user });
      },
      html: function () {
        res.render('users/show', { user: user });
      }
    });
  });
}



/**
 * Mapping routes to actions
 */
users.get('/', show);
users.get('/all', index);

module.exports = users;
