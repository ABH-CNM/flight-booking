var router = require('express').Router(),
    booking = require('../models/booking')(),
    response = require('../utils/response');

router.get('/flights/:flight_id/passengers', function(req, res) {
  var flightId = req.params.flight_id;
  booking.findPassengersInFlight(flightId, function(err, result) {
    if (!err) {
      if (result !== booking.NOT_FOUND) {
        response.success(res, { passengers: result });
      } else {
        response.notFound(res, 'Flight with flight id ' + flightId + ' does not exist.');
      }
    } else {
      error.internalError(res);
    }
  });
});

router.get('/passengers/all', function(req, res) {
  booking.findAllPassengers(function(err, passengers) {
    if (!err) {
      response.success(res, { passengers: passengers });
    } else {
      error.internalError(res);
    }
  });
});

router.post('/passengers/create', function(req, res) {
  var bookingId = req.body.bookingId;
  var passenger = req.body.passenger;

  if (Object.keys(passenger).length === 3 &&
    'title' in passenger &&
    'first_name' in passenger &&
    'last_name' in passenger) {
    booking.addNewPassenger(bookingId, passenger, function(err, result) {
      if (!err) {
        if (result !== booking.NOT_FOUND) {
          response.success(res, { message: 'Add new passenger successfully.' });
        } else {
          response.notFound(res, 'Booking with id ' + bookingId + ' does not exist.');
        }
      } else {
        response.internalError(res);
      }
    });
  } else {
    response.invalidData(res, 'Invalid passenger data.');
  }
});

module.exports = router;