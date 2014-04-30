var mongoose   = require('mongoose'),
    hubotUtils = require('../lib/hubot'),
    Schema     = mongoose.Schema;

// create schema
var BotSchema = new Schema({
  name: {
    // botname
    type: String,
    required: true,
    trim: true
  },
  adapter: {
    // irc, slack, hipchat, campfire
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    // creation date
    type: Date,
    default: Date.now
  },
  config: {} // different adapters require different env variables
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