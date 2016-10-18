# Flight booking API Doc
## Danh sách mã sân bay đi
Trả về các mã sân bay đi có trong CSDL
* URL: `/flights/departures/all`
* Method: `GET`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "departures": [
          "SGN",
          "TBB"
        ]
      }
    }
    ```
* Sample Call:
```javascript
request.get(URL + '/flights/departures/all', function(err, response, body) {
  printResult(body);
});
```
## Liệt kê các sân bay đến
Liệt kê danh sách các mã sân bay đến tương ứng với sân bay đi
* URL: `/flights/arrivals?departure=[string]`
* Method: `GET`
* Query Params:
  * Required:
    * `departure=[string]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "arrivals": [
          "TBB"
        ]
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Arrivals with departure id SN not found."
      }
    }
    ```
* Sample Call:
```javascript
request.get(URL + '/flights/arrivals?departure=' + departureId, function(err, response, body) {
  printResult(body);
});
```
## Tìm chuyến bay
Tìm chuyến bay với nơi đi, nơi đến, ngày đi và số chỗ trống
* URL: `/flights/available?departure=[string]&arrival=[string]&date=[string]&seats_amount=[integer]`
* Method: `GET`
* Query Params:
  * Required:
    * `departure=[string]`
    * `arrival=[string]`
    * `date=[string]`
    * `seats_amount=[integer]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "flights": [
          {
            "_id": "5805f95a6f075322c4a68791",
            "flight_id": "BL326",
            "departure": "SGN",
            "arrival": "TBB",
            "date": "2016-10-05",
            "hours": "08:45",
            "class": "Y",
            "price": "E",
            "seats_amount": 100,
            "cost": 100000
          },
          {
            "_id": "5805f95a6f075322c4a68792",
            "flight_id": "BL326",
            "departure": "SGN",
            "arrival": "TBB",
            "date": "2016-10-05",
            "hours": "08:45",
            "class": "Y",
            "price": "F",
            "seats_amount": 20,
            "cost": 10000
          },
          {
            "_id": "5805f95a6f075322c4a68793",
            "flight_id": "BL326",
            "departure": "SGN",
            "arrival": "TBB",
            "date": "2016-10-05",
            "hours": "08:45",
            "class": "C",
            "price": "G",
            "seats_amount": 10,
            "cost": 500000
          }
        ]
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "There are no available flights."
      }
    }
    ```
* Sample Call:
```javascript
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
    printResult(body);
  }
);
```
## Tạo đặt chỗ mới
Tạo đặt chỗ với mã đặt chỗ, thời gian tạo và trạng thái đặt chỗ là 0 (đang đặt chỗ)
* URL: `/booking/create`
* Method: `PUT`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "booking": {
          "booking_id": "K6K5AN",
          "status": 0,
          "time": "2016-10-18 17:35:14",
          "_id": "5805fae2c6fbf322cc027800"
        }
      }
    }
    ```
* Sample Call:
```javascript
request.put(URL + '/booking/create', function(err, response, body) {
  printResult(body);
});
```
## Thông tin đặt chỗ
Trả về thông tin mã đặt chỗ
* URL: `/booking/:booking_id`
* Method: `GET`
* URL Params:
  * Required:
    * `booking_id=[string]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "booking": {
          "_id": "5805fc5c2eacf51cc4762f7f",
          "booking_id": "ABCXYZ",
          "time": "2016-05-01 10:00:00",
          "cost": 400000,
          "status": 1,
          "flight_details": [
            {
              "flight_id": "BL326",
              "date": "2016-10-05",
              "class": "Y",
              "price": "E"
            },
            {
              "flight_id": "BL327",
              "date": "2016-10-06",
              "class": "Y",
              "price": "E"
            }
          ],
          "passengers": [
            {
              "title": "MR",
              "last_name": "NGUYEN",
              "first_name": "VAN A"
            },
            {
              "title": "MR",
              "last_name": "TRAN",
              "first_name": "THI B"
            }
          ]
        }
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Booking with id ABCYZ does not exist."
      }
    }
    ```
* Sample Call:
```javascript
request.get(URL + '/booking/' + bookingId, function(err, response, body) {
  printResult(body);
});
```
## Cập nhật trạng thái đặt chỗ
Cập nhật trạng thái đặt chỗ, với 2 trạng thái là 0 - đang đặt chỗ và 1 - đã đặt chỗ
* URL: `/booking/:booking_id/update_status/:status`
* Method: `POST`
* URL Params:
  * Required:
    * `booking_id=[string]`
    * `status=[integer]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "message": "Booking status updated."
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Booking with id ABXYZ does not exist."
      }
    }
    ```
  * Code: `400`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Invalid booking status."
      }
    }
    ```
* Sample Call:
```javascript
request.post(URL + '/booking/' + bookingId + '/update_status/' + status, function(err, response, body) {
  printResult(body);
  done();
});
```
## Danh sách chặng bay theo mã đặt chỗ
Liệt kê danh sách các chặng bay theo mã đặt chỗ
* URL: `/booking/:booking_id/flight_details`
* Method: `GET`
* URL Params:
  * Required:
    * `booking_id=[string]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "flight_details": [
          {
            "flight_id": "BL326",
            "date": "2016-10-05",
            "class": "Y",
            "price": "E"
          },
          {
            "flight_id": "BL327",
            "date": "2016-10-06",
            "class": "Y",
            "price": "E"
          }
        ]
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Flight details with booking id ACXYZ not found."
      }
    }
    ```
* Sample Call:
```javascript
request.get(URL + '/booking/' + bookingId + '/flight_details', function(err, response, body) {
  printResult(body);
});
```
## Thêm chặng bay mới
Thêm chặng bay mới ứng với mã đặt chỗ
* URL: `/booking/:booking_id/add_flight_detail`
* Method: `POST`
* URL Params:
  * Required:
    * `booking_id=[string]`
* Data Params:
  * Required:
    * `flight_id=[string]`
    * `date=[string]`
    * `class=[string]`
    * `price=[string]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "message": "Add flight detail successfully."
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Booking with booking id ABXYZ does not exist."
      }
    }
    ```
* Sample Call:
```javascript
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
    console.log(JSON.stringify(body, null, 2));
    done();
  }
);
```
## Danh sách hành khách đi trên 1 chuyến bay
Liệt kê danh sách hành khách trên 1 chuyến bay
* URL: `/flights/:flight_id/passengers/`
* Method: `GET`
* URL Params:
  * Required:
    * `flight_id=[string]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "passengers": [
          {
            "title": "MR",
            "last_name": "NGUYEN",
            "first_name": "VAN A"
          },
          {
            "title": "MR",
            "last_name": "TRAN",
            "first_name": "THI B"
          }
        ]
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Flight with flight id BL386 does not exist."
      }
    }
    ```
* Sample Call:
```javascript
var flightId = 'BL326';
request.get(URL + '/flights/' + flightId + '/passengers', function(err, response, body) {
  printResult(body);
  done();
});
```
## Danh sách tất cả hành khách
Liệt kê danh sách tất cả hành khách đã đặt vé
* URL: `/passengers/all`
* Method: `GET`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "passengers": [
          {
            "title": "MR",
            "last_name": "NGUYEN",
            "first_name": "VAN A"
          },
          {
            "title": "MR",
            "last_name": "TRAN",
            "first_name": "THI B"
          }
        ]
      }
    }
    ```
* Sample Call:
```javascript
request.get(URL + '/passengers/all', function(err, response, body) {
  printResult(body);
  done();      
});
```
## Thêm mới hành khách
Thêm một hành khách mới
* URL: `/passengers/create`
* Method: `POST`
* Data Params:
  * Required:
    * `booking_id=[string]`
    * `passenger=[Object]`
* Success Response
  * Code: `200`
  * Content:
    ```
    {
      "status": "success",
      "data": {
        "message": "Add new passenger successfully."
      }
    }
    ```
* Error Response:
  * Code: `404`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Booking with id ABXYZ does not exist."
      }
    }
    ```
  * Code: `400`
  * Content:
    ```
    {
      "status": "fail",
      "data": {
        "message": "Invalid passenger data."
      }
    }
    ```
* Sample Call:
```javascript
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
    console.log(JSON.stringify(body, null, 2));
    done();
  }
);
```
