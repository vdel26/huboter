/**
 * Routers for different controllers
 */
var coreRoutes  = require('../routes/index'),
    botsRoutes  = require('../routes/bots'),
    usersRoutes = require('../routes/users');

/**
 * Attach routers to app
 */
module.exports = function (app) {
  app.use('/', coreRoutes);
  app.use('/bots', botsRoutes);
  app.use('/users', usersRoutes);
}