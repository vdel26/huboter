var shell = require('shelljs');

function Bot () {
  this.configVars = [];
  this.running = false;
}

Bot.prototype.create = function (cb) {
  var list = shell.ls();
  shell.exec('')
  cb(list);
}

Bot.prototype.launch = function () {
  shell.cd('/home/ubuntu/hubot-test/testbot/');
  shell.exec('./start_slackhubot.sh', {silent: false, async: true}, function (code, output) {
    this.running = true;
  });
  console.log('launching new bot...');
}

module.exports = Bot;
