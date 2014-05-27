var assert   = require('assert'),
    express  = require('express'),
    mongoose = require('mongoose'),
    _        = require('underscore');

var config = require('../config/config').test;
require('../config/db')(mongoose, config);

var hubotUtilsMock = require('./utils').hubotUtilsMock;
var BotSchema = require('../models/bot')(hubotUtilsMock);
var UserSchema = require('../models/user')();
var User = mongoose.model('User', UserSchema);
var Bot = mongoose.model('Bot', BotSchema);


describe('Bot Model', function () {

  var userId, testBot;

  before(function (done) {
    User.create({name: 'Tobi'}, function (err, result) {
      userId = result.id;
      testBot = {name: 'testbot', adapter: 'slack', owner: userId, config: {HUBOT_SLACK_TOKEN: 'token'}};
      done();
    });
  });

  after(function (done) {
    User.remove({}, function (err) {
      Bot.remove({}, function (err) {
        done();
      });
    });
  });

  beforeEach(function () {
    _.functions(hubotUtilsMock).forEach(function (method) {
      hubotUtilsMock.called[method] = 0;
    });
  });

  it ('should successfully create bot with correct properties', function (done) {
    var mybot = new Bot(testBot);
    mybot.save(function (err, res) {
      assert.equal(err, undefined);
      assert.equal(res.name, 'testbot');
      assert(res.createdAt instanceof Date);
      assert(hubotUtilsMock.called.findPort === 1);
      assert(hubotUtilsMock.called.prepareEnv === 1);
      done();
    });
  });

  it ('should require an existing user as the owner', function (done) {
    var badBot = {name: 'testbot', adapter: 'slack', owner: '123456'};
    var mybot = new Bot(badBot);
    mybot.save(function (err, res) {
      assert(err, err.message);
      done();
    });
  });

  it('should be saved with the PORT and BOTNAME as env vars', function (done) {
    var mybot = new Bot(testBot);
    mybot.save(function (err, res) {
      assert.equal(res.config.PORT, '7070');
      assert.equal(res.config.HUBOT_SLACK_BOTNAME, 'testbot');
      done();
    });
  });

  it('should save, create and deploy a bot', function (done) {
    var mybot = new Bot(testBot);
    mybot.createAndDeploy(function (err, res) {
      assert.equal(err, undefined);
      assert.equal(res.name, 'testbot');
      assert.equal(res.config.HUBOT_SLACK_TOKEN, 'token');
      assert(hubotUtilsMock.called.create === 1);
      assert(hubotUtilsMock.called.launch === 1);
      done();
    });
  });
});