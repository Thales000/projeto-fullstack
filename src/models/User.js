const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: String,
  password: String,
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;