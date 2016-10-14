// for more information about database configuration for testing, visit https://www.terlici.com/2014/09/15/node-testing.html

var MongoClient = require('mongodb').MongoClient,
    config = require('../config.js');

const MODE_PRODUCTION = 'mode_production';
const MODE_TEST = 'mode_test';  // create a new database for running test with mocha

var state = {
  db: null,
  mode: null
};

// connect to mongodb database, with 2 modes: production or test
// database URI is retrieved from ./config.js
function connect(mode, done) {
  if (isConnected()) {
    return done();
  }

  // choose database URI base on mode
  var uri = null;
  if (mode === MODE_PRODUCTION) {
    uri = config.database.production_uri;
  } else if (mode === MODE_TEST) {
    uri = config.database.test_uri;
  } else {
    return done(new Error("Mode is not valid!"));
  }

  // connect
  MongoClient.connect(uri, function(err, db) {
    if (!err) {
      state.db = db;
      state.mode = mode;
      done();
    } else {
      return done(err);
    }
  });
}

// rest of application can access mongodb db object through this function
function getDb() {
  return state.db;
}

// drop database
// after completed a test, you need destroy test database to avoiding conflict
function drop(done) {
  if (!state.db) {
    return done(new Error("Missing database connection!"));
  }

  db.dropDatabase();
}

// add collection to database from fixture (json file contain test data)
// userful for testing
function fixture(collection, done) {
  if (!state.db) {
    return done(new Error("Missing database connection!"));
  }

  var collectionName = collection.name;
  var documents = collection.documents;
  db.collection(collectionName).insertMany(documents, function(err, result) {
    if (!err) {
      done(result);
    } else {
      done(err);
    }
  });
}

// check if database is connected
function isConnected() {
  return state.db !== null;
}

module.exports = {
  MODE_PRODUCTION,
  MODE_TEST,
  connect,
  getDb,
  drop,
  fixture
};