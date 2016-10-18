var home = require('./home'),
    flight = require('./flight'),
    booking = require('./booking'),
    passenger = require('./passenger');

function setupRoute(app) {
  app.use('/', home);
  app.use('/', flight);
  app.use('/', booking);
  app.use('/', passenger);
}

module.exports = setupRoute;