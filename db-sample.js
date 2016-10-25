var database = require('./src/utils/database');
var bookingData = require('./test/fixtures/booking');
var flightData = require('./test/fixtures/flight');

database.connect(function(err) {
  if (!err) {
    database.drop(function(err) {
      var count = 0;
      var fixtures = [bookingData, flightData];
      fixtures.forEach(function(fixture) {
        database.fixture(fixture, function(err) {
          count += 1;
          if (count === fixtures.length - 1) {
            console.log("Create database samples successfully.");
          }
        });
      });
    });
  } else {
    console.error(err);
  }
});
