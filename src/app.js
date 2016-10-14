var path = require('path'),
    express = require('express'),
    config = require('./config'),
    database = require('./utils/database'),
    setupRoute = require('./routes/index');

var app = express();

function initialize() {
  app.set('port', process.env.PORT || config.default_port);
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

function launch() {
  database.connect(database.MODE_PRODUCTION, function(err) {
    if (!err) {
      setupRoute(app);
      app.listen(app.get('port'));
      console.log("Server is listening on port", app.get('port'));
    }
    else {
      console.error(err);
    }
  });
}

module.exports = {
  initialize,
  launch
};