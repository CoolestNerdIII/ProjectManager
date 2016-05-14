var mongoose = require('mongoose');

// define the schema for the item model
var itemSchema = mongoose.Schema({
    title: {type: String, index: true },
    itemDescription: String,
    startDate: {type: Date, default: null, index: true},
    endDate: {type: Date, default: null, index: true},
    creationDate: {type: Date, default: Date.now, index: true},
    status: {type: String, default: 'BACKLOG'}, // BACKLOG, IN_PROGRESS, TESTING, COMPLETE
    completionTime: Number,
    category: {type: mongoose.Schema.ObjectId, ref: 'Category'},
    sprint: {type: mongoose.Schema.ObjectId, ref: 'Sprint'}
});

// methods
itemSchema.methods.findSimilarCategory = function (cb) {
    "use strict";
    return this.model('Item').find({category: this.category}, cb);
};

// create the model and expose it to the app
module.exports = mongoose.model('Item', itemSchema);