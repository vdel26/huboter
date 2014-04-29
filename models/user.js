var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var UserSchema = new Schema({
  name: { type: String, default: ''},
  createdAt: {type: Date, default: Date.now}
});

// register model User
module.exports = mongoose.model('User', UserSchema);