const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: String,
    searchTerm: String,
    timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema, 'logs');

module.exports = Log;