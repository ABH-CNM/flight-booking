var router = require('express').Router(),
    flight = require('../models/flight')(),
    error = require('../utils/error');

router.get('/flights/departures/all', function(req, res) {
  flight.findAllDepartures(function(err, departs) {
    if (!err) {
      res.json(departs);
    } else {
      error.internalError(res);
    }
  });
});

router.get('/flights/arrivals', function(req, res) {
  var departureId = req.query.departure;
  flight.findArrivals(departureId, function(err, arrivals) {
    if (!err) {
      res.json(arrivals);
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
  flight.findFlights(departure, arrival, date, seats_amount, function(err, flights) {
    if (!err) {
      res.json(flights);      
    } else {
      error.internalError(res);
    }
  });
});

module.exports = router;