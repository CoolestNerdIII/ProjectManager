// Imports
var mongoose = require('mongoose');
var Items = require('./item');

// define the schema for the sprint model
var sprintSchema = mongoose.Schema({
    name: {type: String, index: true },
    dateCreated: {type: Date, default: Date.now},
    startDate: {type: Date, default: null, index: true },
    endDate: {type: Date, default: null, index: true }
});

// methods
// Returns all of the items in the sprint
sprintSchema.methods.getItems = function(cb) {
    "use strict";
    return Items.find({ sprint: this._id }, cb);
};

// create the model and expose it to the app
module.exports = mongoose.model('Sprint', sprintSchema);