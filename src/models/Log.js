const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: String,
    searchTerm: String,
    dateAndHour: { type: Date, default: Date.now },
}, { versionKey: false });

const Log = mongoose.model('Log', logSchema, 'logs');

module.exports = Log;