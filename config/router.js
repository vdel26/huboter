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
  res.locals.userid = req.user._id
  debug('routing for user %s', res.locals.userid);
  next();
}

function hasAuthorization (req, res, next) {
  if (req.user.id !== req.params.userid) {
    return res.send(401, 'User is not authorized');
  }
  next();
}


/**
 * Attach routers to app
 */
module.exports = function (app) {
  // authentication routes
  app.use('/', coreRoutes);

  // routes below this point require being logged in
  app.use(auth.requiresLogin);

  // users
  app.use('/user', usersRoutes);

  // bots
  app.param('userid', loadUser);
  app.param('userid', hasAuthorization);
  app.use('/:userid/bots', botsRoutes);
}
