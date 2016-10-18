var router = require('express').Router(),
    booking = require('../models/booking')(),
    error = require('../utils/error');

router.put('/booking/create', function(req, res) {
  booking.createBooking(function(err, newBooking) {
    if (!err) {
      res.json(newBooking);
    }
    else {
      error.internalError(res);
    }
  });
});

router.get('/booking/:booking_id', function(req, res) {
  var bookingId = req.params.booking_id;
  booking.findBookingInfo(bookingId, function(err, bookingInfo) {
    if (!err) {
      res.json(bookingInfo);
    } else {
      error.internalError(res);
    }
  });
});

router.post('/booking/:booking_id/update_status/:status', function(req, res) {
  var bookingId = req.params.booking_id;
  var status = req.params.status;
  booking.updateBookingStatus(bookingId, status, function(err, updatedBooking) {
    if (!err) {
      res.json(updatedBooking);
    } else {
      error.internalError(res);
    }
  });
});

router.get('/booking/:booking_id/flight_details', function(req, res) {
  var bookingId = req.params.booking_id;
  booking.findFlightDetails(bookingId, function(err, flightDetails) {
    if (!err) {
      res.json(flightDetails);
    } else {
      error.internalError(res);
    }
  });
});

router.post('/booking/:booking_id/add_flight_detail', function(req, res) {
  var bookingId = req.params.booking_id;
  var flightDetail = {
    flight_id: req.body.flight_id,
    date: req.body.date,
    class: req.body.class,
    price: req.body.price    
  };
  console.log(flightDetail);

  booking.addFlightDetail(bookingId, flightDetail, function(err, result) {
    if (!err) {
      res.json(result);
    } else {
      err.internalError(res);
    }
  });
});

module.exports = router;