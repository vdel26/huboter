var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    debug    = require('debug')('model:user');


module.exports = function () {
  // create schema
  var UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });


  // store hashed version of user's password
  UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    // hash the password and store it
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    })
  });

  UserSchema.methods = {
    /**
     * compare a candidate pwd with the hashed pwd in the database
     * @param  {String}   password – candidate password
     * @param  {Function} cb       – callback(err, isMatch)
     */
    comparePassword: function (password, cb) {
      bcrypt.compare(password, this.password, cb);
    }

  }

  return UserSchema;
}