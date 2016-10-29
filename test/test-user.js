var expect = require('chai').expect;
var request = require('request');
var database = require('../src/utils/database');
var app = require('../src/app');
var User = require('../src/models/User');

const URL = 'http://localhost:3001';

describe("User routing test", function() {
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

  it("should protect admin route", function(done) {
    request({
      url: URL + '/test',
      method: 'GET',
      headers: {
        "x-access-token": 'a malicious token'
      }
    }, function(err, response, body) {
      expect(response.statusCode).to.equal(403);
      done();
    });
  });
});