define([
	"controllers/dom",
	"controllers/requests",
	"controllers/router"
], function (dom, requests, Router) {
	var session;

	session = {

		get: function () {
			if (localStorage.getItem("session")) {
				return JSON.parse(localStorage.getItem("session"));
			} else {
				return false;
			}
		},

		set: function (data) {
			localStorage.setItem("session", JSON.stringify(data));
		},

		unset: function () {
			localStorage.removeItem("session");
		},

		getLogin: function () {

			var self = this,
				router = new Router();

			$(dom.login).on("submit", function (e) {
				e.preventDefault();
				var $this = $(this),
					token = dom.getValue($this, "token"),
					req = requests.get("/api/token/" + token);

				req.done(function (session) {
					self.set(session);
					if (localStorage.getItem("route")) {
						// User has saved route, pass them there
						router.go(localStorage.getItem("route"));
						localStorage.removeItem("route");
					} else {
						// "Fresh" login, send to projects list
						router.go("/projects");
					}
				});

				req.fail(function (xhr) {
					dom.showError(xhr.responseText);
				});
			});
		}
	};

	return session;

});
