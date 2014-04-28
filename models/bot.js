var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var BotSchema = new Schema({
  name: { type: String, default: ''},       // botname
  adapter: { type: String, default: ''}     // irc, slack, hipchat, campfire
});

// TODO: "pre" action for create -> deploy new Hubot
// TODO: "pre" action for destroy -> destroy Hubot

// register model Bot
mongoose.model('Bot', BotSchema);