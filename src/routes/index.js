var booking = require('./booking');
var admin = require('./admin');

function apiRoutes(app) {
	app.use('/', booking);
  app.use('/', admin);
}

module.exports = apiRoutes;