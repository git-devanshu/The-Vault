const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title : {type : String, required : true},
    note : {type : String, required : true},
    categoryColor : {type : String, required : true}
});

const Notes = mongoose.model('notes', notesSchema, 'notes');

module.exports = {Notes};
