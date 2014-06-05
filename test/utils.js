
var mongoose   = require('mongoose'),
    config     = require('../config/config').test;


/**
 * mock hubotUtils
 */

var hubotUtilsMock = {

  // keeps counters for number of times each
  // hubotUtils method has been called
  called: {},

  findPort: function (cb) {
    this.called.findPort++;
    cb(null, '7070');
  },
  create: function (name, cb) {
    this.called.create++;
    cb({
        code: 0,
        output: 'bot successfully created',
        pid: 0
      });
  },
  prepareEnv: function (configVars) {
    this.called.prepareEnv++;
  },
  installDeps: function (name, adapter, cb) {
    this.called.installDeps++;
    cb(0, 'npm install successfull');
  },
  launch: function (name, cb) {
    this.called.launch++;
    cb({
        code: 0,
        output: 'bot successfully launched',
        pid: 0
      });
  }
};
exports.hubotUtilsMock = hubotUtilsMock;


/**
 * Initialize models for tests
 */

var UserSchema = require('../models/user')();
var BotSchema  = require('../models/bot')(hubotUtilsMock);
require('../config/db')(mongoose, config);

exports.initModels = function () {
  mongoose.model('User', UserSchema)
  mongoose.model('Bot', BotSchema)
};
