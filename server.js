var path = require('path'),
    express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    config = require('./config'),
    setupRoute = require('./routes/index');

(function() {
  var app = express();
  var flightBooking = {
    initialize(port) {
      app.set('port', process.env.PORT || port);
      app.set('view engine', 'pug');
      app.use(express.static(path.join(__dirname, 'public')));
    },
    launch() {
      MongoClient.connect(config.dbUrl, function(err, db) {
        var port = app.get('port') || config.defaultPort;
        if (!err) {
          app.db = db;  // convenient access db object through express app
          setupRoute(app);
          app.listen(port);
          console.log("Server is running on port", port);
        }
        else {
          console.error("Can't connect to MongoDB server on port", port);
        }
      });
    }
  };

  flightBooking.initialize(3000);
  flightBooking.launch();
})();