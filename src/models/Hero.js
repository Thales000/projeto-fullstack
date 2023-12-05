const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  imageURL: String,
  name: String,
  attr: String,
  attackType: String,
});

const HeroModel = mongoose.model('Hero', heroSchema, 'heroes');

module.exports = HeroModel;