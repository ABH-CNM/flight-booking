var router = require('express').Router(),
    flight = require('../models/flight')(),
    response = require('../utils/response');

router.get('/flights/departures/all', function(req, res) {
  flight.findAllDepartures(function(err, departs) {
    if (!err) {
      response.success(res, { departures: departs });
    } else {
      error.internalError(res);
    }
  });
});

router.get('/flights/arrivals', function(req, res) {
  var departureId = req.query.departure;
  flight.findArrivals(departureId, function(err, result) {
    if (!err) {
      if (result !== flight.NOT_FOUND) {
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
  flight.findFlights(departure, arrival, date, seats_amount, function(err, result) {
    if (!err) {
      if (result !== flight.NOT_FOUND) {
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