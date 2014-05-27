var debug = require('debug')('config:db');

/**
 * DB CONNECTION
 */
// connect to mongodb

module.exports = function (mongoose, config) {
  var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    mongoose.connect(config.db, options);
    debug('db connected ok');
  }
  connect();

  // error handler
  mongoose.connection.on('error', function (err) {
    console.log(err);
    debug('db connection error');
  });

  // reconnect when closed
  mongoose.connection.on('disconnected', function () {
    connect();
  });
};
