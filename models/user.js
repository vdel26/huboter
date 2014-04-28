var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var UserSchema = new Schema({
  name: { type: String, default: ''}
});

// register model User
mongoose.model('User', UserSchema);