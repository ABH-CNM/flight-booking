var router = require('express').Router(),
    booking = require('../models/booking')(),
    flight = require('../models/flight')(),
    response = require('../utils/response');

router.put('/booking/create', function(req, res) {
  booking.createBooking(function(err, newBooking) {
    if (!err) {
      response.success(res, { booking: newBooking });
    }
    else {
      error.internalError(res);
    }
  });
});

router.get('/booking/:booking_id', function(req, res) {
  var bookingId = req.params.booking_id;
  booking.findBookingInfo(bookingId, function(err, result) {
    if (!err) {
      if (result !== booking.NOT_FOUND) {
        response.success(res, { booking: result });
      } else {
        response.notFound(res, 'Booking with id ' + bookingId + ' does not exist.');
      }
    } else {
      error.internalError(res);
    }
  });
});

router.post('/booking/:booking_id/update_status/:status', function(req, res) {
  var bookingId = req.params.booking_id;
  var status = parseInt(req.params.status);

  if (status === booking.BOOKING_STATUS_PENDING || status === booking.BOOKING_STATUS_APPROVED) {
    booking.updateBookingStatus(bookingId, status, function(err, result) {
      if (!err) {
        if (result !== booking.NOT_FOUND) {
          response.success(res, { message: 'Booking status updated.' });
        } else {
          response.notFound(res, 'Booking with id ' + bookingId + ' does not exist.');
        }  
      } else {
        response.internalError(res);
      }
    });
  } else {
    response.invalidData(res, 'Invalid booking status.');
  }
});

router.get('/booking/:booking_id/flight_details', function(req, res) {
  var bookingId = req.params.booking_id;
  booking.findFlightDetails(bookingId, function(err, result) {
    if (!err) {
      if (result !== booking.NOT_FOUND) {
        response.success(res, { flight_details: result });
      } else {
        response.notFound(res, 'Flight details with booking id ' + bookingId + ' not found.');
      }
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

  flight.findFlightById(flightDetail.flight_id, function(err, flightResult) {
    if (!err) {
      if (flightResult !== flight.NOT_FOUND) {
        booking.addFlightDetail(bookingId, flightDetail, function(err, bookingResult) {
          if (!err) {
            if (bookingResult !== booking.NOT_FOUND) {
              response.success(res, { message: 'Add flight detail successfully.' });
            } else {
              response.notFound(res, 'Booking with booking id ' + bookingId + ' does not exist.');
            }
          } else {
            response.internalError(res);
          }
        });      
      } else {
        response.notFound(res, 'Flight with flight id ' + flightDetail.flight_id + ' does not exist.');
      }
    } else {
      response.internalError(res);
    }

  });


});

module.exports = router;