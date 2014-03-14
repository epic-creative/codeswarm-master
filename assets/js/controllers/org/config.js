define([
  'knockout',
  'request',
  'dom',
  'github',
  'session',
  'plugins/router',
  'base64',
], function (ko, request, dom, Github, session, router) {

  var ctor = {

    // Check that user is logged in
    canActivate: function () {
      session.isLoggedIn(function (sess) {
        if (!sess) {
          router.navigate('/user/login');
        }
      });
      // This is required for Durandal
      return true;
    },

    // Set displayName
    displayName: 'Project Config',

    // Initialization
    activate: function (org, repo) {
      // Set param props
      this.param_org = org;
      this.param_repo = repo;
      // If not new project, load data from endpoint
      if (repo !== 'new-project') {
        this.tryGetProject();
        this.newProject = ko.observable(false);
      } else {
        this.newProject = ko.observable(true);
      }
      // Get tokens
      this.getToken();
    },

    compositionComplete: function () {
      // Activate sidebar switcher
      dom.sidebarSwitcher();
    },

    // Define model
    token: ko.observable(false),
    title: ko.observable(),
    repo: ko.observable(),
    branch: ko.observable(),
    public: ko.observable(),
    repos: ko.observableArray(),

    // GITHUB INTEGRATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    getToken: function () {
      var self = this;
      var req = request({
        url: '/tokens/github',
        type: 'GET'
      });

      req.done(function (data) {
        self.token(data.token);
        self.tryGetUser();
      });

      req.fail(function (err) {
        console.error(err);
      });
    },

    // Try to get user
    tryGetUser: function (data) {
      var github = new Github({
        token: this.token(),
        auth: 'oauth'
      });
      var user = github.getUser();
      this.tryGetRepos(user);
    },

    // Try to get org and user repos
    tryGetRepos: function (user) {
      user.repos('admin', function (err, repos) {
        console.log(repos);
      });

      // Get orgs
      user.orgs(function (err, orgs) {
        if (!err) {
          for (var org in orgs) {
            getOrgRepos(orgs[org].login);
          }
        }
      });

      var getOrgRepos = function (org) {
        user.orgRepos(org, function(err, repos) {
          console.log(repos);
        });
      };
    },

    // GET PROJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Define get request
    getProjectRequest: {
      url: function () {
        return '/projects/' + ctor.param_org + '/' + ctor.param_repo;
      },
      type: 'GET'
    },

    // Get project
    tryGetProject: function () {
      var self = this;

      // Make Request
      var req = request(this.getProjectRequest);

      // On success
      req.done(function (data) {
        console.log(data);
        // Loop through data response
        for (var prop in data) {
          // Assing model attr value with returned val
          self[prop](data[prop]);
        }
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    },

    // SAVE PROJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Define save project request
    saveProjectRequest: {
      url: function () {
        if (ctor.newProject) {
          return '/projects';
        } else {
          return '/projects/' + ctor.param_org + '/' + ctor.param_repo;
        }
      },
      type: 'PUT'
    },

    trySaveProject: function () {

      // Set payload
      var payload = {
        title: this.title(),
        repo: this.title(),
        sha: this.sha(),
        branch: this.branch()
      };

      // If new project, set to POST
      if (this.newProject()) {
        this.saveProjectRequest.type = 'POST';
      }

      // Make request
      var req = request(this.saveProjectRequest, payload);

      // On success
      req.done(function (data) {
        dom.showNotification('success', 'Project successfully saved');
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    }

  };

  return ctor;
});
