var expect = require('chai').expect,
    database = require('../src/utils/database'),
    flight = require('../src/models/flight')(),
    booking = require('../src/models/booking')(),
    bookingData = require('./fixtures/booking.json'),
    flightData = require('./fixtures/flight.json');

describe("Flight Booking Test", function() {
  before(function(done) {
    database.connect(database.MODE_TEST, done);
  });

  beforeEach(function(done) {
    var count = 0;
    database.drop(function(err) {
      var fixtures = [bookingData, flightData];
      fixtures.forEach(function(fixture) {
        database.fixture(fixture, function(err) {
          count += 1;
          if (count === fixtures.length - 1) {
            done();
          }
        });
      });
    });
  });

  // mã sân bay đi ...
  it("GET flights/departures/all", function(done) {
    flight.getAirportDepartures(function(err, departs) {
      expect(departs).to.deep.equal(['SGN', 'TBB']);
      done();
    });
  });

  // mã sân bay đến...
  it("GET flights/arrivals?departure_id=...", function(done) {
    var departId = 'SGN';
    flight.getAirportArrivals(departId, function(err, arrivals) {
      expect(arrivals).to.deep.equal(['TBB']);
      done();      
    });
  });

  // tạo đặt chỗ mới
  it("PUT booking/create", function(done) {
    booking.createBooking(function(err) {
      done(err);
    });
  });

  // thông tin mã đặt chỗ
  it("GET booking/:booking_id", function(done) {
    var bookingId = 'ABCXYZ';
    booking.getBookingInfo(bookingId, function(err, bookingInfo) {
      expect(bookingInfo).to.deep.equal(bookingData.documents[0]);
      done();
    });
  });

  // cập nhật trạng thái...
  it("POST booking/:booking_id/update_status", function(done) {
    var bookingId = 'ABCXYZ';
    var status = 0;
    booking.updateBookingStatus(bookingId, status, function(err, result) {
      done();
    });
  });

  // danh sách chặng bay
  it("GET booking/flight_details", function(done) {
    booking.getFlightDetails(function() {
      done();
    });
  });

  // hành khách đi trên 1 chuyến bay nào đó
  it("GET booking/passengers?flight_id=...", function(done) {
    var flightId = 'BL326';
    booking.getPassentersInFlight(flightId, function(err, passengers) {
      expect(passengers).to.deep.equal(bookingData.documents[0].passengers);
      done();
    });
  });

  // danh sách tất cả hành khách
  it("GET booking/passengers/all", function(done) {
    booking.getAllPassengers(function(err, passengers) {
      expect(passengers).to.deep.equal(bookingData.documents[0].passengers);
      done();      
    });
  });

  // tìm chuyến bay ..
  it("GET flight?departure=...&arrival...=&date...=&seats_amount=...", function(done) {
    var depart = 'SGN';
    var arrive = 'TBB';
    var date = '2016-10-05';
    var amount = 100;
    flight.findFlights(depart, arrive, date, amount, function(err, flights) {
      console.log(flights);
      done();
    });
  });

  // thêm mới hành khách
  it("PUT booking/passengers/create", function(done) {
    var bookingId = 'ABCXYZ';
    var passenger = {
      title: 'ms',
      last_name: 'nguyen',
      first_name: 'luom'
    };
    booking.addNewPassenger(bookingId, passenger, function(err, result) {
      done();
    });
  });



 });
