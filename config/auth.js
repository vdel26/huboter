var LocalStrategy = require('passport-local'),
    mongoose      = require('mongoose'),
    debug         = require('debug')('config:auth');

// user model
var User = mongoose.model('User');


// serialize the user id to push into the session
exports.serializeUser = function(user, done) {
  debug('serializeUser: ' + user.id);
  done(null, user.id);
};


// deserialize the user object based on a pre-serialized token
// which is the user id
exports.deserializeUser = function(id, done) {
  User.findOne({ _id: id }, function(err, user) {
    debug('deserializeUser: ' + user.id);
    done(err, user);
  });
};


/**
 * Passportjs strategy to use local (username + pwd) authentication
 */
exports.passportStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ name: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      user.comparePassword(password, function (err, isMatch) {
        debug('is valid password? ' + isMatch);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
      });

    });
  }
);


/**
 * Middleware to use in any route where
 * you want to require login
 */
exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) next();
  else {
    debug('Redirecting because user is not logged in');
    res.redirect('/login');
  }
};