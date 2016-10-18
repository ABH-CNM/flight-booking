var database = require('../utils/database'),
    expect = require('chai').expect;

const FLIGHT_COLLECTION = 'flight';

function flight() {
  return {
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
        callback);
    },

    findFlights: function(depart, arrive, date, amount, callback) {
      var db = database.getDb();
      db.collection(FLIGHT_COLLECTION)
        .find(
          {
            departure: depart,
            arrival: arrive,
            date: date,
            seats_amount: amount
          })
        .toArray(callback);
    },
  };
}

module.exports = flight;

