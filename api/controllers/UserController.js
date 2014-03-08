var db     = require('../db');
var users  = require('../db/users');

/**
 * SessionController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


  /**
   *    `POST /users`
   */
  create: function (req, res) {
    users.create(req.body, replied);

    function replied(err) {
      if (err) res.send(err.status_code || 500, err);
      else res.json({ok: true});
    }
  },


  /**
   *    `GET /user`
   */
  get: function (req, res) {
    var user = req.session.username();
    if (! user) return res.send(403, new Error('No user in session'));

    users.get(user, replied);

    function replied(err, user) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(user);
    }
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}


};
