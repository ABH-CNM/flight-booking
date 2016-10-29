var router = require('express').Router();
var Booking = require('../models/booking');
var Flight = require('../models/flight');
var response = require('../utils/response');

router.put('/booking/create', function(req, res) {
  Booking.createBooking(function(err, newBooking) {
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
  Booking.findBookingInfo(bookingId, function(err, result) {
    if (!err) {
      if (result !== Booking.NOT_FOUND) {
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

  if (status === Booking.BOOKING_STATUS_PENDING || status === Booking.BOOKING_STATUS_APPROVED) {
    Booking.updateBookingStatus(bookingId, status, function(err, result) {
      if (!err) {
        if (result !== Booking.NOT_FOUND) {
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
  Booking.findFlightDetails(bookingId, function(err, result) {
    if (!err) {
      if (result !== Booking.NOT_FOUND) {
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

  Flight.findFlightById(flightDetail.flight_id, function(err, flightResult) {
    if (!err) {
      if (flightResult !== Flight.NOT_FOUND) {
        Booking.addFlightDetail(bookingId, flightDetail, function(err, bookingResult) {
          if (!err) {
            if (bookingResult !== Booking.NOT_FOUND) {
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

router.get('/flights/:flight_id/passengers', function(req, res) {
  var flightId = req.params.flight_id;
  Booking.findPassengersInFlight(flightId, function(err, result) {
    if (!err) {
      if (result !== Booking.NOT_FOUND) {
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
  Booking.findAllPassengers(function(err, passengers) {
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
    Booking.addNewPassenger(bookingId, passenger, function(err, result) {
      if (!err) {
        if (result !== Booking.NOT_FOUND) {
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

router.get('/flights/departures/all', function(req, res) {
  Flight.findAllDepartures(function(err, departs) {
    if (!err) {
      response.success(res, { departures: departs });
    } else {
      error.internalError(res);
    }
  });
});

router.get('/flights/arrivals', function(req, res) {
  var departureId = req.query.departure;
  Flight.findArrivals(departureId, function(err, result) {
    if (!err) {
      if (result !== Flight.NOT_FOUND) {
        response.success(res, { arrivals: result });
      } else {
        response.notFound(res, 'Arrivals with departure id ' + departureId + ' not found.');
      }
    } else {
      error.internalError(res);
    }
  });
});

router.get('/flights/available', function(req, res) {
  var departure = req.query.departure;
  var arrival = req.query.arrival;
  var date = req.query.date;
  var seats_amount = parseInt(req.query.seats_amount);
  Flight.findFlights(departure, arrival, date, seats_amount, function(err, result) {
    if (!err) {
      if (result !== Flight.NOT_FOUND) {
        response.success(res, { flights: result });
      } else {
        response.notFound(res, 'There are no available flights.');
      }
    } else {
      error.internalError(res);
    }
  });
});


module.exports = router;