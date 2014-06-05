var assert    = require('assert'),
    mongoose  = require('mongoose'),
    _         = require('underscore'),
    testUtils = require('../utils');


testUtils.initModels();
var User = mongoose.model('User');


describe('User Model', function () {

  after(function (done) {
    // cleanup
    User.remove({}, function (err) {
      done();
    });
  });

  it('should create user when passed the required parameters', function (done) {
    var newUser = new User({ name: 'Tobi', password: 'Mypwd123456'});
    newUser.save(function (err, user) {
      assert.equal(err, undefined);
      assert.equal(user.name, 'Tobi');
      assert.notEqual(user.password, undefined);
      assert(user.createdAt instanceof Date);
      done();
    });
  });

  it('should validate a correct password', function (done) {
    var newUser = new User({ name: 'Tobi', password: 'Mypwd123456'});
    newUser.save(function (err, user) {
      user.comparePassword('Mypwd123456', function (err, isMatch) {
        assert.equal(err, undefined);
        assert(isMatch);
        done();
      });
    });
  });

  it('should detect a wrong password', function (done) {
    var newUser = new User({ name: 'Tobi', password: 'Mypwd123456'});
    newUser.save(function (err, user) {
      user.comparePassword('badPwd8900', function (err, isMatch) {
        assert.equal(err, undefined);
        assert(!isMatch);
        done();
      });
    });
  });


});