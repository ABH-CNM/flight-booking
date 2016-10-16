var database = require('../utils/database'),
    expect = require('chai').expect;

function flight() {
  return {
    getAirportDepartures: function(callback) {
      var db = database.getDb();
      var flightCollection = db.collection('flight');
      flightCollection.distinct('departure', function(err, departs) {
        if (!err) {
          callback(err, departs);
        } else {
          callback(err);
        }
      });
    },

    getAirportArrivals: function(departId, callback) {
      var db = database.getDb();
      var flightCollection = db.collection('flight');
      flightCollection.distinct('arrival', {departure: departId}, function(err, arrivals) {
        if (!err) {
          callback(err, arrivals);
        }
        else {
          callback(err);
        }
      });
    },

    findFlights: function(depart, arrive, date, amount, callback) {
      var db = database.getDb();
      db.collection('flight').find({departure: depart, arrival: arrive, date: date, seats_amount: amount}).toArray(function(err, flights) {
        callback(err, flights);
      });
    },
  };
}

module.exports = flight;

