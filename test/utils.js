/**
 * mock hubotUtils
 */

exports.hubotUtilsMock = {
  called: {},

  findPort: function (cb) {
    this.called.findPort++;
    cb(null, '7070');
  },
  create: function (name, cb) {
    this.called.create++;
    cb({
        code: 0,
        output: 'bot successfully created',
        pid: 0
      });
  },
  prepareEnv: function (configVars) {
    this.called.prepareEnv++;
  },
  installDeps: function (name, adapter, cb) {
    this.called.installDeps++;
    cb(0, 'npm install successfull');
  },
  launch: function (name, cb) {
    this.called.launch++;
    cb({
        code: 0,
        output: 'bot successfully launched',
        pid: 0
      });
  }
};