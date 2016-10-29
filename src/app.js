var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var database = require('./utils/database');
var apiRoutes = require('./routes/index');

var app = express();

var defaultPort = resolvePort();
app.set('port', process.env.PORT || defaultPort);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('secret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..', 'public')));

app.start = function(callback) {
  database.connect(function(err) {
    if (!err) {
      apiRoutes(app);
      app.listen(app.get('port'));
      console.log("Server is listening on port", app.get('port'));
    }
    else {
      console.error(err);
    }
    if (callback) { callback(); }
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

module.exports = app;