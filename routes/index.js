var express    = require('express'),
    hubotUtils = require('../lib/hubot'),
    passport   = require('passport'),
    mongoose   = require('mongoose'),
    debug      = require('debug')('route:auth');


/* routes with basePath / */
var router = express.Router();

/* Model */
var User = mongoose.model('User');


function index (req, res) {
  res.redirect('/user');
}


/**
 * Auth routes
 */

function login (req, res) {
  if (req.user) res.redirect('/user');
  else res.render('login');
}

function logout (req, res){
  req.logout();
  res.redirect('/login');
}

function signup (req, res) {
  if (req.user) res.redirect('/user');
  else res.render('signup');
}

function create (req, res, next) {
  debug('creating user...');
  var newUser = new User({
    name: req.body.username,
    password: req.body.password
  });

  newUser.save(function (err, user) {
    if (err) {
      debug(err);
      next(err);
    }
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/user');
    });
  });
}



/**
 * Mapping routes to actions
 */
router.get('/', index);
router.get('/login', login);
router.get('/logout', logout);
router.post('/login',
  passport.authenticate('local', { successRedirect: '/user',
                                   failureRedirect: '/login'}));
router.get('/signup', signup);
router.post('/signup', create);

module.exports = router;