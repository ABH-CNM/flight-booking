var expect = require('chai').expect,
    database = require('../src/utils/database'),
    booking = require('./fixtures/booking.json'),
    flight = require('./fixtures/flight.json'),
    flightDetail = require('./fixtures/flight-detail.json'),
    passenger = require('./fixtures/passenger.json');

describe("Database testing", function() {
  before(function(done) {
    database.connect(database.MODE_TEST, done);
  });

  beforeEach(function(done) {
    database.drop(function(err) {
      if (!err) {
        database.fixture(booking, function(err) {
          if (!err) {
            database.fixture(flight, function(err) {
              if (!err) {
                database.fixture(flightDetail, function(err) {
                  if (!err) {
                    database.fixture(passenger, function(err) {
                      done();
                    });
                  } else {
                    return done(err);
                  }
                });
              } else {
                return done(err);
              }
            });
          } else {
            return done(err);
          }
        });
      } else {
        return done(err);
      }
    });
  });

  it("should have 4 collections", function(done) {
    var db = database.getDb();
    db.listCollections().toArray(function(err, collections) {
      expect(collections.length).to.equal(4);
      done();
    });
  });
});
