// for more information about database configuration for testing,
// visit https://www.terlici.com/2014/09/15/node-testing.html

var MongoClient = require('mongodb').MongoClient,
    config = require('../config.js');

var flightBookingDb = null;

// connect to mongodb database, with 2 modes: production or test
// database URI is retrieved from ./config.js
function connect(done) {
  if (isConnected()) {
    return done();
  }

  // choose database URI base on mode
  var uri = resolveDbUri();

  // connect
  MongoClient.connect(uri, function(err, db) {
    if (!err) {
      flightBookingDb = db;
      done();
    } else {
      return done(err);
    }
  });
}

// rest of application can access mongodb db object through this function
function getDb() {
  return flightBookingDb;
}

// drop database
// after completed a test, you need destroy test database to avoiding conflict
function drop(done) {
  if (!isConnected()) {
    return done(new Error("Missing database connection!"));
  }

  flightBookingDb.dropDatabase(function(err) {
    done();
  });
}

// add collection to database from fixture (json file contain test data)
// userful for testing
function fixture(collection, done) {
  if (!isConnected()) {
    return done(new Error("Missing database connection!"));
  }

  var collectionName = collection.name;
  var documents = collection.documents;
  flightBookingDb.collection(collectionName).insertMany(documents, function(err, result) {
    if (!err) {
      done();
    } else {
      done(err);
    }
  });
}

// check if database is connected
function isConnected() {
  return flightBookingDb !== null;
}

function resolveDbUri() {
  var mode = process.env.NODE_ENV;
  var dbUri = '';
  switch (mode) {
  case 'production':
    dbUri = config.production.dbUri;
    break;
  case 'development':
    dbUri = config.development.dbUri;
    break;
  case 'test':
    dbUri = config.test.dbUri;
    break;
  default:
    dbUri = config.development.dbUri;
    break;
  }
  return dbUri;
}

module.exports = {
  connect,
  getDb,
  drop,
  fixture
};