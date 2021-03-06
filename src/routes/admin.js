var router = require('express').Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');
var Flight = require('../models/flight');
var response = require('../utils/response');
var path = require('path');

router.get('/form-login', function(req, res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return response.forbidden(res, 'You do not have permission to access this resource.');
      } else {
        res.sendFile(path.join(__dirname, 'form-login.html'));
      }
    });
  } else {
    res.send('You do not have permission to access this resource. Please login!');
  }
});

router.post('/admin/authenticate', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.authAsAdmin(username, password, function(err, token) {
    if (!err) {
      response.success(res, { message: 'Hello, my admin.', token: token });
    } else {
      response.notFound(res, 'Invalid username or passord.');
    }
  });
});

// route middleware to guard admin's routes
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return response.forbidden(res, 'You do not have permission to access this resource.');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return response.forbidden(res, 'You do not have permission to access this resource.');
  }
});

router.get('/form-login', function(req, res){
  res.sendFile(path.join(__dirname, 'form-login.html'));
});

// CUD operatons for flight here
router.get('/test', function(req, res) {
  res.json({message: 'you make it.'});
});

// day ak? tao flight
router.post('/flight/create', function(req, res) {
  var flight = req.body.flight;
  flight.cost = parseInt(flight.cost);
  flight.seats_amount = parseInt(flight.seats_amount);
// console.log("routes: flight/create1");
  Flight.createFlight(flight, function(err, result) {
    if (!err) {
      console.log("routes: flight/create");
      response.success(res, { flight: result });
    } else {
      console.log("routes: flight/create   error");
      error.internalError(res);

    }
  });
});

// update flight
router.put('/flight/update/:id', function(req, res) {
 // console.log("routes: flight/update");
 var flight_object_id = req.params.id;
  Flight.updateFlight(flight_object_id, req.body.flight, function(err, result) {
    if (!err) {
      console.log("routes: flight/update");
      response.success(res, { flight: result });
    } else {
      console.log("routes: flight/update   error");
      error.internalError(res);

    }
  });
});

// remove flight
router.delete('/flight/remove/:id', function(req, res) {
 // console.log("routes: flight/remove");
 var flight_object_id = req.params.id;
  Flight.removeFlight(flight_object_id, function(err, result) {
    if (!err) {
      console.log("routes: flight/remove");
      response.success(res, { flight: result });
    } else {
      console.log("routes: flight/remove   error");
      error.internalError(res);
    }
  });
});

router.get('/flights/all', function(req, res) {
  Flight.findAllFlights(function(err, flights) {
    if (!err) {
      response.success(res, {flights: flights});
    } else {
      response.notFound(res, 'There are no flights');
    }
  });
});

module.exports = router;