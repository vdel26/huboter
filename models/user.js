var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// register model User
module.exports = mongoose.model('User', UserSchema);