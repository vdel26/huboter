var passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose      = require('mongoose');

// user model
var User = mongoose.model('User');


module.exports = function (passport) {

  // serialize the user id to push into the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });


  // deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function(err, user) {
      done(err, user);
    });
  });


  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

}
