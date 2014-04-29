var mongoose   = require('mongoose'),
    hubotUtils = require('../lib/hubot'),
    Schema = mongoose.Schema;

// create schema
var BotSchema = new Schema({
  name: { type: String, default: ''},         // botname
  adapter: { type: String, default: ''},      // irc, slack, hipchat, campfire
  createdAt: {type: Date, default: Date.now}  // creation date
});


// TODO: "pre" action for create -> deploy new Hubot
// TODO: "pre" action for destroy -> destroy Hubot


// static methods
BotSchema.statics = {
  createBot: function (cb) {
    // hubotUtils.create();
  },
  launchBot: function (cb) {
    // hubotUtils.launchBot();
  },
  terminateBot: function (cb) {

  }
};

// instance methods
BotSchema.methods = {

};

// register model Bot
module.exports = mongoose.model('Bot', BotSchema);