var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    debug    = require('debug')('model:user');


module.exports = function () {
  // create schema
  var UserSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  return UserSchema;
}