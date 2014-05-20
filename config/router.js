/**
 * Routers for different controllers
 */
var coreRoutes  = require('../routes/index'),
    botsRoutes  = require('../routes/bots'),
    usersRoutes = require('../routes/users'),
    debug       = require('debug')('route:main-router');

/**
 * Middleware
 */
function loadUser (req, res, next) {
  req.userid = res.locals.userid = req.params.userid;
  debug('routing for user %s', res.locals.userid);
  next();
}


/**
 * Attach routers to app
 */
module.exports = function (app) {
  // general
  app.use('/', coreRoutes);

  // users
  app.use('/users', usersRoutes);

  // bots
  app.param('userid', loadUser);
  app.use('/:userid/bots', botsRoutes);
}
