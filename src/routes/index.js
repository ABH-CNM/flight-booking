var booking = require('./booking');
var admin = require('./admin');

function apiRoutes(app) {
  app.use('/', admin);
  app.use('/', booking);
}

module.exports = apiRoutes;