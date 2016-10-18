var database = require('../utils/database'),
    expect = require('chai').expect;

const FLIGHT_COLLECTION = 'flight';
const NOT_FOUND = 'resource not found';

function flight() {
  return {
    NOT_FOUND,
    findAllDepartures: function(callback) {
      var flightCollection = database.getDb().collection(FLIGHT_COLLECTION);
      var departureField = 'departure';
      flightCollection.distinct(departureField, callback);
    },

    findArrivals: function(departId, callback) {
      var flightCollection = database.getDb().collection(FLIGHT_COLLECTION);
      var arrivalField = 'arrival';
      flightCollection.distinct(
        arrivalField,
        { departure: departId },
        function(err, result) {
          if (result.length > 0) {
            callback(err, result);
          } else {
            callback(err, NOT_FOUND);
          }
        });
    },

    findFlights: function(depart, arrive, date, amount, callback) {
      var db = database.getDb();
      db.collection(FLIGHT_COLLECTION)
        .find(
          {
            departure: depart,
            arrival: arrive,
            date: date,
            seats_amount: { $gte: amount }
          })
        .toArray(function(err, result) {
          if (result.length > 0) {
            callback(err, result);
          } else {
            callback(err, NOT_FOUND);
          }
        });
    },

    findFlightById: function(flightId, callback) {
      var db = database.getDb();
      db.collection(FLIGHT_COLLECTION).findOne({ flight_id: flightId }, function(err, flight) {
        if (flight !== null) {
          callback(err, flight);
        } else {
          callback(err, NOT_FOUND);
        }
      });
    },
  };
}

module.exports = flight;

