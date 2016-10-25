var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    database = require('./utils/database'),
    setupRoute = require('./routes/index');

var app = express();

function initialize() {
  var defaultPort = resolvePort();
  app.set('port', process.env.PORT || defaultPort);
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

function launch() {
  database.connect(function(err) {
    if (!err) {
      setupRoute(app);
      app.listen(app.get('port'));
      console.log("Server is listening on port", app.get('port'));
    }
    else {
      console.error(err);
    }
  });
};

function resolvePort() {
  var mode = process.env.NODE_ENV;
  var port;
  switch (mode) {
  case 'production':
    port = config.production.port;
    break;
  case 'development':
    port = config.development.port;
    break;
  case 'test':
    port = config.test.port;
    break;
  default:
    port = config.development.port;
    break;
  }
  return port;
}

module.exports = {
  initialize,
  launch
};