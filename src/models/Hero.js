const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  imageURL: String,
  name: String,
  attr: String,
  attackType: String,
}, { versionKey: false });

const Hero = mongoose.model('Hero', heroSchema, 'heroes');

module.exports = Hero;