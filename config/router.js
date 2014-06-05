/**
 * Routers for different controllers
 */
var coreRoutes  = require('../routes/index'),
    botsRoutes  = require('../routes/bots'),
    usersRoutes = require('../routes/users'),
    passport    = require('passport'),
    auth        = require('../config/auth'),
    debug       = require('debug')('route:main-router');

/**
 * Middleware
 */
function loadUser (req, res, next) {
  // TODO: use passport's req.user._id in routes instead of this
  // this will be removed soon
  //req.userid = res.locals.userid = req.params.userid;
  res.locals.userid = req.user._id
  debug('routing for user %s', res.locals.userid);
  next();
}


/**
 * Attach routers to app
 */
module.exports = function (app) {
  // authentication routes
  app.use('/', coreRoutes);

  // require login for any other route below this
  app.use(auth.requiresLogin);

  // users
  app.use('/user', usersRoutes);

  // bots
  app.param('userid', loadUser);
  app.use('/:userid/bots', botsRoutes);
}
