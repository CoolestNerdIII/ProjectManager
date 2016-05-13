// Imports
var mongoose = require('mongoose');
var Items = require('./item');

// define the schema for the category model
var categorySchema = mongoose.Schema({
    name: String,
    categoryDescription: String,
    created: {type: Date, default: Date.now }
});

// methods
// Returns all of the items in the category
categorySchema.methods.getItems = function (cb) {
    "use strict";
    return Items.find({ category: this._id}, cb);
};

// create the model and expose it to the app
module.exports = mongoose.model('Category', categorySchema);