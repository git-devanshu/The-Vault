const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
    noteDate : {type : String, required : true},
    note : {type : String, required : true},
    categoryColor : {type : String, required : true}
});

const Daily = mongoose.model('daily', dailySchema, 'daily');

module.exports = {Daily};
