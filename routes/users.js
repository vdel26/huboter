var express  = require('express'),
    mongoose = require('mongoose');

/* routes with basePath /users */
var users = express.Router();

/* Model */
var User = mongoose.model('User');


/* INDEX – GET /users - get all users */
function index (req, res) {
  User.find({}, function (err, results) {
    if (err) console.log('ERROR'); // use logger
    res.render('users/index', { users: results });
  });
}


/**
 * Mapping routes to actions
 */
users.get('/', index);

module.exports = users;
