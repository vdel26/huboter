var shell = require('shelljs'),
    util  = require('util');

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

/* create a new bot */
exports.create = function (cb) {
  var botname = 'testbot-' + Date.now().toString();
  shell.cd('/home/ubuntu/hubot-test/');

  var childProc = shell.exec('hubot --create ' + botname, function (code, output) {
    if (typeof(cb) === 'function') {
      var data = {
        code: code,
        output: output,
        childProc: childProc
      };
      cb(data);
    }
  });
}

var prepareEnv = exports.prepareEnv = function () {
// TODO: set ENV variables and params depending on input
// find available port – http://github.com/indexzero/node-portfinder
  process.env.HUBOT_SLACK_TOKEN = 'bu6WipeZyzK7h0R7Ygleoiof';
  process.env.HUBOT_SLACK_TEAM= 'whatzon';
  process.env.HUBOT_SLACK_BOTNAME= 'slackbot';
  process.env.PORT = 8081;
  process.env.HUBOT_ADAPTER = 'slack';
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