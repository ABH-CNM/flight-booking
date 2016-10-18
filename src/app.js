var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    database = require('./utils/database'),
    setupRoute = require('./routes/index');

var app = express();

function initialize() {
  app.set('port', process.env.PORT || config.default_port);
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

function launch() {
  var arg = process.argv[2];
  if (isProduction(arg)) {
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
  } else {
    database.connect(database.MODE_TEST, function(err) {
      setupRoute(app);
      app.listen(app.get('port'));
      console.log("Server is listening for testing on port", app.get('port'));
    });
  }
}

function isProduction(option) {
  return option !== 'test';
}

module.exports = {
  initialize,
  launch
};