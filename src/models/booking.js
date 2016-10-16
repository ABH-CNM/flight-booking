var database = require('../utils/database'),
    expect = require('chai').expect;

function booking() {
  const BOOKING_COLLECTION = 'booking'
  const BOOKING_STATUS_PENDING = 0;
  const BOOK_STATUS_APPROVED = 1;
  
  return {
    createBooking: function(callback) {
      var bookingId = generateBookingId(),
          bookingStatus = BOOKING_STATUS_PENDING,
          bookingDate = getBookingDate();

      var bookingDoc = {
        booking_id: bookingId,
        status: bookingStatus,
        time: bookingDate,
      };
      var bookingCollection = database.getDb().collection('booking');
      bookingCollection.insertOne(bookingDoc, callback);
    },

    getBookingInfo: function(book_id, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).findOne({booking_id: book_id}, function(err, booking) {
        callback(err, booking);
      });
    },

    updateBookingStatus: function(bookingId, status, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).update({booking_id: bookingId}, {$set: {status: status}}, function() {
        callback();
      });
    },

    getPassentersInFlight: function(flightId, callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).find({'flight_details.flight_id': {$eq: flightId}}).toArray(function(err, bookings) {
        var passengers = [];
        for (var i = 0; i < bookings.length; i++) {
          var booking = bookings[i];
          var passengersPerBooking = booking.passengers;
          passengers = passengers.concat(passengersPerBooking);
        }
        callback(err, passengers);
      });
    },

    getAllPassengers: function(callback) {
      var db = database.getDb();
      db.collection(BOOKING_COLLECTION).find().toArray(function(err, bookings) {
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
      db.collection(BOOKING_COLLECTION).updateOne({booking_id: bookingId}, {$push: {passengers: passenger}}, function(err, item) {
        callback(err, item);
      });
    }
  };

  function getBookingDate() {
    var date = new Date();
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
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
