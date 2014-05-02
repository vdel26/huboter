var assert   = require('assert'),
    request  = require('supertest'),
    app      = require('../app'),
    mongoose = require('mongoose'),
    Bot      = mongoose.model('Bot');


/**
 * INTEGRATION TESTS FOR routes/bots
 */

describe('bots routes', function () {

  beforeEach(function (done) {
    // empty collection
    Bot.remove({}, function (err) {
      done();
    });
  });

  /* GET /bots */
  it('should return a list with no bots', function (done) {
    request(app)
      .get('/bots')
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
      .post('/bots')
      .send({name: 'testbot', adapter: 'testadapter'})
      .end(function (err, res) {
        if (err) throw err;
        Bot.find({}, function (err, results) {
          assert.equal(results.length, 1);
          assert.equal(results[0].name, 'testbot');
          assert.equal(results[0].adapter, 'testadapter');
          done();
        });
      });
  });

  /* PUT /bots/:id */
  it('should update bot configuration', function (done) {
    Bot.create({name: 'testbot', adapter: 'hipchat'}, function (err, newbot) {
      request(app)
        .put('/bots/' + newbot.id)
        .send({ name: 'johnbot', config: {HUBOT_HIPCHAT_TOKEN: 'randomTOKEN'} })
        .end(function (err, res) {
          Bot.findOne({ _id: newbot.id }, function (err, result) {
            assert.equal(result.name, 'johnbot');
            assert.equal(result.config.HUBOT_HIPCHAT_TOKEN, 'randomTOKEN');
            done();
          });
        });
    });
  });

});