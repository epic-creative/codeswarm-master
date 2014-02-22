var uuid = require('../../lib/uuid');
var db      = require('./');

/// create

exports.create = createProject;

function createProject(project, cb) {

  project = {
    _id:    project._id,
    repo:   project.repo,
    branch: project.branch,
    owners: project.owners,
    public: project.public,
    secret: uuid()
  };

  (function _createProject() {
    db.privileged('projects', function(err, db) {
      if (err) cb(err);
      else db.insert(project, project._id, replied);
    });

    function replied(err, reply) {
      if (err && err.status_code == 404 && err.reason == 'no_db_file') {
        createProjectsDB(function(err) {
          if (err) cb(err);
          else _createProject();
        });
      } else {
        if (err && err.status_code == '409')
          err.message = 'Project already exists';
        cb(err, reply);
      }
    }
  })();
}

function createProjectsDB(cb) {
  db.privileged(function(err, db) {
    if (err) cb(err);
    else db.db.create('projects', replied);
  });

  function replied(err) {
    if (err && err.status_code == 404) cb();
    else cb(err);
  }
}


/// listFor

exports.listFor = projectListFor;

function projectListFor(username, cb) {

  _projectListFor();

  function _projectListFor() {
    db.privileged('projects', function(err, db) {
      if (err) cb(err);
      else db.view('views', 'owned_by', {keys: [username]}, replied);
    });
  }

  function replied(err, reply) {
    if (err && err.status_code == 404 && err.reason == 'missing') {
      createProjectsOwnedByView(function(err) {
        console.log(err);
        if (err) cb(err);
        else _projectListFor();
      });
    }
    else if (err && err.status_code == 404 && err.reason == 'no_db_file') {
      createProjectsDB(function(err) {
        if (err) cb(err);
        else _projectListFor();
      });
    }
    else if (err) cb(err);
    else cb(null, reply.rows.map(prop('value')));
  }
}


function createProjectsOwnedByView(cb) {
  db.privileged('projects', function(err, db) {
    if (err) cb(err);
    else {
      db.insert({
        'views': {
          'owned_by': {
            'map':
              function(doc) {
                if (doc.owners) {
                  doc.owners.forEach(function(owner) {
                    emit(owner, doc);
                  });
                }
              }
          }
        }
      }, '_design/views', cb);
    }
  });
}


/// get

exports.get = getProject;

function getProject(id, cb) {
  db.privileged('projects', function(err, projects) {
    if (err) cb(err);
    else projects.get(id, cb);
  });
}


/// update

exports.update = updateProject;

function updateProject(id, attrs, cb) {
  db.privileged('projects', function(err, projects) {
    if (err) cb(err);
    else {
      projects.get(id, gotProject);
    }

    function gotProject(err, project) {
      if (err) cb(err);
      else {
        for(var attr in attrs)
          project[attr] = attrs[attr];

        projects.insert(project, updatedProject);
      }
    }
  });

  function updatedProject(err) {
    if (err && err.status_code != 409) cb(err);
    else if (err) cb();
    else {
      var sockets = sails.io.sockets.in(id);
      for(var attr in attrs) {
        sockets.emit('update', id, attr, attrs[attr]);
      }
      cb();
    }
  }
}


/// delete

exports.delete = deleteProject;

function deleteProject(project, cb) {
  db.privileged('projects', function(err, projects) {
    if (err) cb(err);
    else projects.destroy(project._id, project._rev, cb);
  });
}


/// Misc

function prop(p) {
  return function(o) {
    return o[p];
  }
}