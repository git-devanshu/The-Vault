const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount : {type : Number, required : true},
    spentAt : {type : String, required : true},
    spentOnDate : {type : Date, required : true},
    trackerName : {type : String, required : true},
});

const Expense = mongoose.model('expense', expenseSchema, 'expense');

module.exports = {Expense};
