var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    // index: {}
  }
})
var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function () {
    this.on('creating', this.hashPassword);
  },
  comparePassword: function (attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function (err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function () {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function (hash) {
        this.set('password', hash);
      });
  }
});

module.exports = User;