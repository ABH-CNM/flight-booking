var expect = require('chai').expect;
var request = require('request');
var database = require('../src/utils/database');
var app = require('../src/app');
var User = require('../src/models/User');

const URL = 'http://localhost:3001';

describe("User routing test", function() {
 // var t = null;
  before(function(done) {
    app.start(done);
  });

  beforeEach("should create a superuser", function(done) {
    database.drop(function(err) {
      if (!err) {
        var user = {
          username: 'jinich',
          password: '1234qwer'
        }
        User.createSuperuser(user, function(err, superuser) {
          expect(err).to.be.null;
          expect(superuser.username).to.equal('jinich');
          done();
        });
      }
    });
  });


  it("should access admin route", function(done) {
    request({
      url: URL + '/admin/authenticate',
      method: 'POST',
      dataType: 'json',
      json: {
        username: 'jinich',
        password: '1234qwer'
      }
    }, function(err, response, body) {
      var token = body.data.token;
      t = token;
      request({
        url: URL + '/test',
        method: 'GET',
        headers: {
          "x-access-token": token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    }); 
  });


  // test create flight
  // it("POST /flight/create", function(done){
  //   console.log("test: flight/create")
  //  // console.log(t);
  //   var flight = {
  //       flight_id: 'BL330',
  //       departure: 'TBB',
  //       arrival: 'ANG',
  //       date: '2016-05-05',
  //       hours: '07:00',
  //       class: 'Y',
  //       price: 'E',
  //       seats_amount: '50',
  //       cost: '100000'      
  //     };
  //   request(
  //     {
  //       url: URL + '/flight/create',
  //       method: 'POST',
  //       dataType: 'json',
  //       headers: {
  //         "x-access-token": t
  //       },        
  //       json: {
  //         flight: flight
  //       }
  //     },
  //     function(error, response, body) {
  //       console.log(body);
  //       expect(response.statusCode).to.equal(200);
  //       done();
  //     }
  //   ); 

  // });


  // test update flight
  // it("PUT /flight/update/:id", function(done){
  //   console.log("test: flight/update")
  //  // console.log(t);
  //  var flight_object_id = "5815679a7509677eac491884";
  //   var flight = {
  //       flight_id: 'BL331',
  //       departure: 'TBB',
  //       arrival: 'ANG',
  //       date: '2016-05-05',
  //       hours: '07:00',
  //       class: 'Y',
  //       price: 'E',
  //       seats_amount: '50',
  //       cost: '100000'      
  //     };
  //   request(
  //     {
  //       url: URL + '/flight/update/' + flight_object_id,
  //       method: 'PUT',
  //       dataType: 'json',
  //       headers: {
  //         "x-access-token": t
  //       },
  //       json: {
  //         flight: flight
  //       }
  //     },
  //     function(error, response, body) {
  //       console.log(body);
  //      // expect(response.statusCode).to.equal(200);
  //       done();
  //     }
  //   ); 
  // });


  // test remove flight
  // it("DELETE /flight/remove/:id", function(done){
  //   console.log("test: flight/remove")
  //  // console.log(t);
  //  var flight_object_id = "5815678226e31993a4fa55c6";
  //   request(
  //     {
  //       url: URL + '/flight/remove/' + flight_object_id,
  //       method: 'DELETE',
  //       dataType: 'json',
  //       headers: {
  //         "x-access-token": t
  //       }
  //     },
  //     function(error, response, body) {
  //       console.log(body);
  //       expect(response.statusCode).to.equal(200);
  //       done();
  //     }
  //   ); 
  // });

  



});