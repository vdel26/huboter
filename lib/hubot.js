var shell = require('shelljs'),
    util  = require('util'),
    _     = require('underscore'),
    path  = require('path'),
    port  = require('portfinder'),
    debug = require('debug')('lib:hubot');

/**
 * hubot-test: parent directory for all bots
 * testbot: a test bot
 */
var defaultParams = {
  HUBOT_ROOT: '/home/ubuntu/hubot-test/testbot',
  HUBOT_HOME: '/home/ubuntu/hubot-test/testbot/node_modules/hubot',
  PIDFILE: '/home/ubuntu/hubot-test/testbot/hubot.pid',
  DAEMON: '/home/ubuntu/hubot-test/testbot/node_modules/hubot/bin/hubot'
};

var defaultEnvVars = {
  HUBOT_SLACK_TOKEN: 'bu6WipeZyzK7h0R7Ygleoiof',
  HUBOT_SLACK_TEAM: 'whatzon',
  HUBOT_SLACK_BOTNAME: 'slackbot',
  PORT: 8081,
  HUBOT_ADAPTER: 'slack'
};


/**
 * Create a new Hubot directory
 * @param  {String}   name – name of the root directory of the bot
 * @param  {Function} cb   – callback function
 */
exports.create = function (name, cb) {
  //var botname = name + '-' + Date.now().toString();
  shell.cd('/home/ubuntu/hubot-test/');

  var childProc = shell.exec('hubot --create ' + name + ' &', function (code, output) {
    if (typeof(cb) === 'function') {
      var data = {
        code: code,
        output: output,
        childProc: childProc
      };
      // TODO: add error as first param to callback if there is any
      return cb(data);
    }
  });
}


var prepareEnv = exports.prepareEnv = function (configVars) {
// TODO: find available port – http://github.com/indexzero/node-portfinder
  configVars = configVars || {};
  configVars = _.defaults(configVars, defaultEnvVars);

  for (var param in configVars) {
    process.env[param] = configVars[param];
  }
};

/**
 * Get paths to Bot directory and executable
 * @param  {String} name – path fragment of the bot
 * @private
 */
var getSystemPaths = function (name) {
  if (!name) return new Error('A name is required');

  var params = {
    HUBOT_ROOT: path.join('/home/ubuntu/hubot-test/', name),
    HUBOT_HOME: path.join('/home/ubuntu/hubot-test/', name, '/node_modules/hubot'),
    PIDFILE: path.join('/home/ubuntu/hubot-test/', name, '/hubot.pid'),
    DAEMON: path.join('/home/ubuntu/hubot-test/', name, '/node_modules/hubot/bin/hubot')
  };

  return params;
}


/**
 * Npm install all Hubot dependencies
 * @param  {String}   name    – path fragment of the bot
 * @param  {String}   adapter – adapter
 * @param  {Function} cb      – callback
 */
exports.installDeps = function (name, adapter, cb) {
  var params = getSystemPaths(name);
  shell.cd(params.HUBOT_ROOT);

  var cmd;
  if (adapter === 'slack') cmd = 'npm install hubot-slack --save';
  else if (adapter === 'irc') cmd = 'npm install hubot-irc --save';
  else if (adapter === 'hipchat') cmd = 'npm install hubot-hipchat --save';
  cmd += ' && npm install';

  shell.exec(cmd, cb);
}


/**
 * Find an unbound port in localhost
 * @param  {Function} cb – callback(err, port)
 */
exports.findPort = function (cb) {
  port.basePort = 8081;
  port.getPort(cb);
}


/**
 * Start running a bot
 * @param  {String}   name – path fragment of the bot
 * @param  {Function} cb   – callback function
 */
exports.launch = function (name, cb) {
  debug('launching bot ' + name);
  var params = getSystemPaths(name);

  var cmd = util.format(
    '/sbin/start-stop-daemon --start --background --pidfile %s --make-pidfile -d %s --exec %s',
    params.PIDFILE, params.HUBOT_ROOT, params.DAEMON);

  var childProc = shell.exec(cmd, function (code, output) {
    if (typeof(cb) === 'function') {
      var data = {
        code: code,
        output: output,
        pid: childProc.pid
      };
      cb(data);
    }
  });
}


/**
 * Stop a running bot
 * @param  {String}   name – path fragment of the bot
 * @param  {Function} cb – callback(data)
 */
exports.stop = function (name, cb) {
  var params = getSystemPaths(name);

  var cmd = util.format('/sbin/start-stop-daemon --stop --pidfile %s', params.PIDFILE);
  shell.exec(cmd, function (code, output) {
    if (typeof(cb) === 'function') {
      var data = {
        code: code,
        output: output
      };
      cb(data);
    }
  });
}


/**
 * Stop a bot and erase its directory
 * @param  {String}   name – path fragment of the bot
 * @param  {Function} cb – callback
 */
exports.destroy = function (name, cb) {
  var params = getSystemPaths(name);

  exports.stop(name, function (data) {
    // TODO: what happens if the bot was not running
    if (data.code !== 0) return cb(new Error('Error stopping bot'));
    shell.rm('-rf', params.HUBOT_ROOT);
    cb(data);
  });
}