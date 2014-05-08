var shell = require('shelljs'),
    util  = require('util'),
    _     = require('underscore'),
    debug = require('debug')('lib:hubot');

/**
 * hubot-test: parent directory for all bots
 * testbot: a test bot
 */
var params = {
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

/* create a new bot */
exports.create = function (name, cb) {
  var botname = name + '-' + Date.now().toString();
  shell.cd('/home/ubuntu/hubot-test/');

  var childProc = shell.exec('hubot --create ' + botname + ' &', function (code, output) {
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
  configVars = _.extend(configVars, defaultEnvVars);

  for (var param in configVars) {
    process.env[param] = configVars[param];
  }
};

/* run a bot */
exports.launch = function (cb) {
  shell.cd('/home/ubuntu/hubot-test/testbot/');
  prepareEnv();

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

/* stop bot */
exports.stop = function (cb) {
  shell.cd('/home/ubuntu/hubot-test/testbot/');

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