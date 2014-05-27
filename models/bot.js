var mongoose   = require('mongoose'),
    Schema     = mongoose.Schema,
    debug      = require('debug')('model:bot');


module.exports = function (hubotUtils) {
  // create schema
  var BotSchema = new Schema({
    name: {
      // botname
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: Schema.ObjectId ,
      ref: 'User',
      required: true
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

  /**
   * "botPath" is the name of this bot directory
   * in the system
   */
  BotSchema.virtual('botPath').get(function() {
    var timestamp = this.createdAt.getTime().toString();
    return this.name + '-' + timestamp;
  });


  BotSchema.pre('save', function (next) {
    var adapter = this.adapter.toUpperCase();
    var envHubotName = 'HUBOT_' + adapter + '_BOTNAME';
    this.config = this.config || {};
    this.config[envHubotName] = this.name;
    this.findPort(function (err, port) {
      this.config.PORT = port;
      hubotUtils.prepareEnv(this.config);
      next();
    }.bind(this));
  });


  // instance methods
  BotSchema.methods = {

    /**
     * Deploy bot and save it
     * @param  {Function} cb  – callback(err, newbot)
     */
    createAndDeploy: function (cb) {
      var self = this;
      this.validate(function (err) {
        if (err) return cb(err);

        hubotUtils.create(self.botPath, function (data) {
          if (data.code !== 0) return cb(new Error('Bot creation failed'));
          debug('deployed bot');


          // here we will be returning the request
          self.save(cb);

          // the following tasks are done out of band
          self.installDeps(function (code, output) {
            if (code !== 0) return new Error('Error installing dependencies');
            self.launch();
          });
        });
      });
    },

    /**
     * Start running the bot
     */
    launch: function () {
      if (Object.getOwnPropertyNames(this.config) === 0) {
        return new Error('There are no environment variables');
      }

      hubotUtils.launch(this.botPath, function (data) {
        if (data.code !== 0) return new Error('Error launching bot');
        debug('started bot with great success!');
      });
    },

    /**
     * Stop running the bot
     */
    stop: function (cb) {
      hubotUtils.stop(this.botPath, function (data) {
        if (data.code !== 0) return cb(new Error('Error stopping bot'));
        debug('stopping bot');
        return cb();
      });
    },

    /**
     * Run `npm install` to install all hubot dependencies
     * @param  {Function} cb  – callback function
     */
    installDeps: function (cb) {
      // hubotUtils.prepareEnv(this.config);
      hubotUtils.installDeps(this.botPath, this.adapter, cb);
    },

    /**
     * Find an unbound port in the Hubot host and validate
     * that has not been taken by any other bot before
     * @param  {Function} cb – callback(err, port)
     */
    findPort: function (cb) {
      hubotUtils.findPort(function (err, port) {
        // TODO: if port is not unique call recursively
        // else cb(err, port)
        cb(err, port);
      });
    },

    /**
     * Destroy bot deleting it from the system and DB
     * @param  {Function} cb – callback(err, destroyedBot)
     */
    destroy: function (cb) {
      hubotUtils.destroy(this.botPath, function (data) {
        this.remove(cb);
      }.bind(this));
    }

  };

  return BotSchema;
}
