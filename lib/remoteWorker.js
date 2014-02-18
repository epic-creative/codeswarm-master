var inherits = require('util').inherits;
var os       = require('os');
var path     = require('path');
var EE2      = require('eventemitter2').EventEmitter2;
var extend   = require('util')._extend;
var Test = require('remote-test');

module.exports = Worker;

function Worker(build) {
  if (! this instanceof Worker) return new Worker();
  EE2.call(this);
  this.build = build;
  this.reset();
}

inherits(Worker, EE2);

var W = Worker.prototype;

W.init = function init(image, cb) {
  var self = this;
  this.remoteTest = new Test(image);
  this.remoteTest.on('ready', function() {
    cb();
  });
};

W.command = function command(command, args, options) {
  var self = this;

  self._pendingCommands ++;

  options = extend({}, options);
  options.cwd = typeof options.cwd == 'undefined' ? this.build.dir : options.cwd;

  self.emit('command', command, args, options);
  var child = this.remoteTest.spawn(command, args, options);
  child.stdout.on('data', onChildStdoutData);
  child.stderr.on('data', onChildStderrData);
  child.once('close', onChildClose);

  return child;

  function onChildStdoutData(d) {
    process.stdout.write('[worker] stdout: ' + d);
    self.emit('stdout', d);
  }

  function onChildStderrData(d) {
    process.stdout.write('[worker] stderr: ' + d);
    self.emit('stderr', d);
  }

  function onChildClose(code) {
    self.emit('close', code);
    if (code != 0) self.emit('error', new Error('Command exited with error code ' + code));

    self._pendingCommands --;

    if (! self._pendingCommands && self._endAfterCommandsEnd) {
      self.emit('end');
    }
  }

};

W.reset = function reset() {
  this._pendingCommands = 0;
  this._endAfterCommandsEnd = false;
};

W.end = function end() {
  if (!this._pendingCommands) {
    this.remoteTest.finish();
    this.emit('end');
  } else {
    this._endAfterCommandsEnd = true;
  }
};

W.dispose = function dispose() {
  this.remoteTest.finish();
};