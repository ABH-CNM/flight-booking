var expect = require('chai').expect,
    request = require('request'),
    database = require('../src/utils/database'),
    flight = require('../src/models/flight')(),
    booking = require('../src/models/booking')(),
    bookingData = require('./fixtures/booking.json'),
    flightData = require('./fixtures/flight.json');

const URL = 'http://localhost:3000';

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
  ///chọn điểm đi ???
  it("GET /flights/departures/all", function(done) {
    request.get(URL + '/flights/departures/all', function(err, response, body) {
      //printResult(body);
      done();
    });
  });

  // mã sân bay đến...
  //hiển thị danh sách điểm đến ???
  it("GET /flights/arrivals?departure=[string]", function(done) {
    var departureId = 'SGN';
    request.get(URL + '/flights/arrivals?departure=' + departureId, function(err, response, body) {
      printResult(body);
      done();      
    });
  });

    // tìm chuyến bay ..
    // Tìm vé máy bay thỏa mã số lượng hành khách với ngày đi và ngày về theo yêu cầu.
    //Nếu không có trả về lỗi hết vé.
  it("GET /flights/available?departure=[string]&arrival=[string]&date=[string]&seats_amount=[integer]", function(done) {
    var depart = 'SGN';
    var arrive = 'TBB';
    var date = '2016-10-05';
    var amount = 2;
    request(
      {
        url: URL + '/flights/available',
        method: 'GET',
        qs: {
          departure: depart,
          arrival: arrive,
          date: date,
          seats_amount: amount
        },
      },
      function(err, response, body) {
        //printResult(body);
        done();
      }
    );
  });

  // tạo đặt chỗ mới
  //Chọn ngày đi, ngày về (nếu có), số lượng hành khách, hạng vé (Y hoặc C)
  it("PUT /booking/create", function(done) {
    request.put(URL + '/booking/create', function(err, response, body) {
      //printResult(body);
      done();
    });
  });

  // thông tin mã đặt chỗ
  it("GET /booking/:booking_id", function(done) {
    var bookingId = 'ABCXYZ';
    request.get(URL + '/booking/' + bookingId, function(err, response, body) {
      //printResult(body);
      done();
    });
  });

  // cập nhật trạng thái...
  it("POST /booking/:booking_id/update_status/:status", function(done) {
    var bookingId = 'ABCXYZ';
    var status = 0;
    request.post(URL + '/booking/' + bookingId + '/update_status/' + status, function(err, response, body) {
      //printResult(body);
      done();
    });
  });

  // danh sách chặng bay theo mã đặt chỗ
  it("GET /booking/:booking_id/flight_details", function(done) {
    var bookingId = 'ABCXYZ';
    request.get(URL + '/booking/' + bookingId + '/flight_details', function(err, response, body) {
      //printResult(body);
      done();
    });
  });

  // thêm chặng bay mới
  it("POST /booking/:booking_id/add_flight_detail", function(done) {
    var bookingId = 'ABCXYZ';
    request(
      {
        url: URL + '/booking/' + bookingId + '/add_flight_detail',
        method: 'POST',
        json: {
          flight_id: 'BL326',
          date: '2016-10-05',
          class: 'C',
          price: 'G'
        }
      },
      function(error, response, body) {
        //console.log(JSON.stringify(body, null, 2));
        done();
      }
    );    
  });

  // hành khách đi trên 1 chuyến bay nào đó
  it("GET /flights/:flight_id/passengers/", function(done) {
    var flightId = 'BL326';
    request.get(URL + '/flights/' + flightId + '/passengers', function(err, response, body) {
      //printResult(body);
      done();
    });
  });

  // danh sách tất cả hành khách
  it("GET /passengers/all", function(done) {
    request.get(URL + '/passengers/all', function(err, response, body) {
      //printResult(body);
      done();      
    });
  });

  // thêm mới hành khách
  it("POST /passengers/create", function(done) {
    var bookingId = 'ABCXYZ';
    var passenger = {
      title: 'ms',
      last_name: 'nguyen',
      first_name: 'luom'
    };
    request(
      {
        url: URL + '/passengers/create',
        method: 'POST',
        json: {
          bookingId: bookingId,
          passenger: passenger
        }
      },
      function(error, response, body) {
        //console.log(JSON.stringify(body, null, 2));
        done();
      }
    );
  });
});

function printResult(result) {
  console.log(JSON.stringify(JSON.parse(result), null, 2));
}