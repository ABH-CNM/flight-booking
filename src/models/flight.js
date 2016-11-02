var database = require('../utils/database');
var FLIGHT_COLLECTION = 'flight';
var NOT_FOUND = 'resource not found';

// define ObjectID
var ObjectID = require('mongodb').ObjectID;

module.exports = {
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

  findAllFlights: function(callback) {
    var collection = database.getDb().collection(FLIGHT_COLLECTION);
    collection.find().toArray(function(err, flights) {
      console.log(flights);
      if (!err) {
        callback(null, flights);
      } else {
        callback(err);
      }
    });
  },

  // create flight
  createFlight: function(flight_object, callback){
     /// console.log("models outside: createFlight")
      var db = database.getDb();
      db.collection(FLIGHT_COLLECTION).insertOne(flight_object, function(err, result) {
        if (!err) {
          var cursor = db.collection(FLIGHT_COLLECTION).find(flight_object).limit(1);
          cursor.next(function(err, flight) {
            callback(null, flight);
          });
        } else {
          callback(err);
        }        
      });
    },

  // update flight
  updateFlight: function(flight_object_id, flight_object, callback){
   // console.log("models outside: updateFlight")
    var db = database.getDb();
    db.collection(FLIGHT_COLLECTION).update(
    { _id: ObjectID(flight_object_id) },
    { $set:
      {
        flight_id: flight_object.flight_id,
        departure: flight_object.departure,
        arrival: flight_object.arrival,
        date: flight_object.date,
        hours: flight_object.hours,
        class: flight_object.class,
        price: flight_object.price,
        seats_amount: flight_object.seats_amount,
        cost: flight_object.cost
      }
    },
     function(err, result) {
        if (!err) {
          console.log("models: updateFlight");
          callback(null, result);
        } else {
          callback(err);
        }  
      }
    );
  },


  // remove flight
  removeFlight: function(flight_object_id, callback){
    var db = database.getDb();
    db.collection(FLIGHT_COLLECTION).remove(
     { _id: ObjectID(flight_object_id) },
     function(err, result) {
        if (!err) {
          console.log("models: removeFlight");
          callback(null, result);
        } else {
          callback(err);
        } 
      }
   )


  },



};


