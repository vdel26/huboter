var mongoose   = require('mongoose'),
    hubotUtils = require('../lib/hubot'),
    Schema     = mongoose.Schema,
    debug      = require('debug')('model:bot');

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
    trim: true,
    enum: ['irc', 'slack', 'hipchat']
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

};

// instance methods
BotSchema.methods = {

  /**
   * Deploy bot and save it
   * @param  {Object}   bot - bot document
   * @param  {Function} cb  – callback function
   */
  createAndDeploy: function (cb) {
    var self = this;
    this.validate(function (err) {
      if (err) return cb(err);

      hubotUtils.create(self.name, function (data) {
        if (data.code !== 0) return cb(new Error('Bot creation failed'));
        debug('deployed bot');
        self.save(cb);
      });
    });
  }

};

// register model Bot
module.exports = mongoose.model('Bot', BotSchema);