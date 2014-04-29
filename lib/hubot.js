var shell = require('shelljs');

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

/* run a bot */
exports.launch = function (cb) {
  shell.cd('/home/ubuntu/hubot-test/testbot/');
  var childProc = shell.exec('./start_slackhubot.sh & ', {silent: false, async: true}, function (code, output) {
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