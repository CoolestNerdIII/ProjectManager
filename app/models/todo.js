// Imports
var mongoose = require('mongoose');

// define the schema
var todoSchema = mongoose.Schema({
    text: String,
    done: Boolean
});

// methods

// create the model and expose it to the app
module.exports = mongoose.model('Todo', todoSchema);