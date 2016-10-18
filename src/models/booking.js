var database = require('../utils/database'),
    expect = require('chai').expect;

const BOOKING_COLLECTION = 'booking'
const BOOKING_STATUS_PENDING = 0;
const BOOK_STATUS_APPROVED = 1;

function booking() {
  return {
    createBooking: function(callback) {
      var bookingId = generateBookingId();
      var bookingStatus = BOOKING_STATUS_PENDING;
      var bookingDate = now();

      var bookingDoc = {
        booking_id: bookingId,
        status: bookingStatus,
        time: bookingDate,
      };
      
      var bookingCollection = database.getDb().collection(BOOKING_COLLECTION);
      bookingCollection.insertOne(bookingDoc, function(err, result) {
        callback(err, bookingDoc);
      });
    },

    findBookingInfo: function(bookingId, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).findOne({ booking_id: bookingId }, callback);
    },

    updateBookingStatus: function(bookingId, status, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).update(
        { booking_id: bookingId },
        { $set: { status: status } },
        callback
      );
    },

    findPassengersInFlight: function(flightId, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION)
        .find({ 'flight_details.flight_id': { $eq: flightId } })
        .toArray(function(err, bookings) {
          var passengers = [];
          for (var i = 0; i < bookings.length; i++) {
            var booking = bookings[i];
            var passengersPerBooking = booking.passengers;
            passengers = passengers.concat(passengersPerBooking);
          }
          callback(err, passengers);
        });
    },

    findAllPassengers: function(callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION)
        .find()
        .toArray(function(err, bookings) {
          var passengers = [];
          for (var i = 0; i < bookings.length; i++) {
            var booking = bookings[i];
            var passengersPerBooking = booking.passengers;
            passengers = passengers.concat(passengersPerBooking);
          }
          callback(err, passengers);
        });
    },

    addNewPassenger: function(bookingId, passenger, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).updateOne(
        { booking_id: bookingId },
        { $push: { passengers: passenger } },
        callback
      );
    },

    findFlightDetails: function(bookingId, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).findOne({ booking_id: bookingId }, function(err, booking) {
        var flightDetails = booking.flight_details;
        callback(err, flightDetails);
      });
    },

    addFlightDetail: function(bookingId, flightDetail, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).updateOne(
        { booking_id: bookingId },
        { $push: { flight_details: flightDetail } },
        callback
      );      
    },
  };

  function now() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  }

  function generateBookingId() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var code = '';
    var codeLength = 6;
    for (var i = 0; i < 6; i++) {
      var randomPos = getRandomNumber(0, letters.length - 1);
      var character = letters.charAt(randomPos);
      code += character;
    }
    return code;
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = booking;
