var router = require('express').Router(),
    booking = require('../models/booking')(),
    error = require('../utils/error');

router.get('/flights/:flight_id/passengers', function(req, res) {
  var flightId = req.params.flight_id;
  booking.findPassengersInFlight(flightId, function(err, passengers) {
    if (!err) {
      res.json(passengers);      
    } else {
      error.internalError(res);
    }
  });
});

router.get('/passengers/all', function(req, res) {
  booking.findAllPassengers(function(err, passengers) {
    if (!err) {
      res.json(passengers);
    } else {
      error.internalError(res);
    }
  });
});

router.post('/passengers/create', function(req, res) {
  var bookingId = req.body.bookingId;
  var passenger = req.body.passenger;
  booking.addNewPassenger(bookingId, passenger, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      error.internalError(res);
    }
  });
});

module.exports = router;