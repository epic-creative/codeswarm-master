var nano        = require('nano');
var cookie      = require('cookie');
var config      = require('../config').couchdb;
var publicCouch = nano(config.url);

module.exports = privileged;

var privilegedCouch;
var loggingIn = false;
var queue = [];

function privileged(dbName, cb) {
  if (! cb && 'function' == typeof dbName) {
    cb = dbName;
    dbName = undefined;
  }

  if (privilegedCouch) {
    var db = dbName ? privilegedCouch.use(dbName) : privilegedCouch.db;
    cb(null, db);
  } else {
    login(function(err, db) {
      db = dbName ? db.use(dbName) : db.db;
      cb(err, db);
    });
  }
}

function login(cb) {
  queue.push(cb);

  if (! loggingIn) {
    loggingIn = true;
    publicCouch.auth(config.admin.username, config.admin.password, replied);
  }
}

function replied(err, res, headers) {
  var sessionId, header;

  loggingIn = false;

  if (err) globalError(err);
  else {
    header = headers['set-cookie'][0];
    if (header) sessionId = cookie.parse(header).AuthSession;
    if (! sessionId) globalError(new Error('no AuthSession cookie found'));
    else {
      privilegedCouch = nano({
        url: config.url,
        cookie: 'AuthSession=' + encodeURIComponent(sessionId)
      });
      replyAll(null, privilegedCouch);
    }
  }
}


function globalError(err) {
  replyAll(err);
}

function replyAll() {
  while(queue.length) queue.shift().apply(null, arguments);
}