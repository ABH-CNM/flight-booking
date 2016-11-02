var jwt = require('jsonwebtoken');
var config = require('../config');
var database = require('../utils/database');

module.exports = {
  createSuperuser: function(user, callback) {
    if (!this.isValidUser(user)) {
      return callback(new Error('Invalid username or password.'));
    }

    // check if user already exist
    var collection = database.getDb().collection('users');
    collection.find().limit(1).hasNext(function(err, result) {
      if (!err) {
        if (!result) {
          // insert to db
          user.admin = true;
          collection.insertOne(user, function(err, r) {
            if (err) {
              return callback(err);
            }
            callback(null, user);
          });
        } else {
          callback(new Error('User already exist.'));
        }
      } else {
        callback(err);
      }
    });
  },
  authAsAdmin: function(username, password, callback) {
    var collection = database.getDb().collection('users');
    var cursor = collection.find({ username: username }).limit(1);
    cursor.hasNext(function(err, result) {
      if (!err) {
        if (result) {
          cursor.next(function(err, user) {
            if (user.password === password) {
              if (user.admin) {
                var token = generateAdminToken(user);
                callback(null, token);
              } else {
                callback(new Error('You are not admin.'));
              }
            } else {
              callback(new Error('Invalid password.'));
            }
          });
        } else {
          callback(new Error('User not found.'));
        }
      } else {
        callback(err);
      }
    });
  },

  isValidUser: function(user) {
    var usernameIsValid = /[0-9a-zA-Z_-]{6,20}/.test(user.username);
    var passwordIsValid = /[a-zA-Z\d!#$%&? "]{8,}/.test(user.password);
    return usernameIsValid && passwordIsValid;
  }
}

function generateAdminToken(user) {
  var token = jwt.sign(user, config.secret, { expiresIn: '24h' });//oldValue = 1h
  return token;
}