var assert   = require('assert'),
    request  = require('supertest'),
    app      = require('../app'),
    mongoose = require('mongoose'),
    Bot      = mongoose.model('Bot'),
    User     = mongoose.model('User');


/**
 * INTEGRATION TESTS FOR routes/bots
 */

describe('Bots API - integration tests', function () {

  var userId, testBot;

  before(function (done) {
    User.create({name: 'Tobi'}, function (err, result) {
      userId = result.id;
      testBot = {name: 'testbot', adapter: 'slack', owner: userId};
      done();
    });
  });

  /* GET /bots */
  it('should return a list with no bots', function (done) {
    request(app)
      .get('/' + userId + '/bots')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        var bots = res.body.bots;
        assert.equal(bots.length, 0);
        done();
      });
  });

  /* POST /bots */
  it('should create a new bot', function (done) {
    request(app)
      .post('/' + userId + '/bots')
      .set('Accept', 'application/json')
      .send(testBot)
      .end(function (err, res) {
        if (err) throw err;
        Bot.find({}, function (err, results) {
          // save to use in later tests
          testBot.id = results[0].id;

          assert.equal(results.length, 1);
          assert.equal(results[0].name, 'testbot');
          assert.equal(results[0].adapter, 'slack');
          done();
        });
      });
  });

  /* PUT /bots/:id */
  it('should update bot configuration', function (done) {
    request(app)
      .put('/' + userId + '/bots/' + testBot.id)
      .send({ config: {HUBOT_SLACK_TOKEN: 'randomTOKEN'} })
      .end(function (err, res) {
        Bot.findOne({ _id: testBot.id }, function (err, result) {
          assert.equal(result.config.HUBOT_SLACK_TOKEN, 'randomTOKEN');
          done();
        });
      });
  });

  after(function (done) {
    Bot.findOne({_id: testBot.id}, function (err, bot) {
      bot.destroy(function (err) {
        done();
      });
    });
  });

});