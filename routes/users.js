var express  = require('express'),
    mongoose = require('mongoose'),
    debug    = require('debug')('route:users');


/* routes with basePath /users */
var users = express.Router();

/* Model */
var User = mongoose.model('User');


/* INDEX – GET /users - get all users */
function index (req, res) {
  User.find({}).populate('bots').exec(function (err, results) {
    if (err) return console.log('ERROR'); // use logger

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
 * Mapping routes to actions
 */
users.get('/', index);

module.exports = users;
