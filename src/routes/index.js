var home = require('./home');

function setupRoute(app) {
  app.use('/', home);
}

module.exports = setupRoute;