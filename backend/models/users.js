const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {type : String, required : true},
    name : {type : String, required : true},
    password : {type : String, required : true},
    vfcode : {type : String, default : '0'},
    securityPin : {type : String, default : ''},
    passwordLabels : {type : Array, default : ['Other']},
    passwordList : [{type : mongoose.Schema.Types.ObjectId, ref : 'passwords'}],
    notesList : [{type : mongoose.Schema.Types.ObjectId, ref : 'notes'}],
    taskList : [{type : mongoose.Schema.Types.ObjectId, ref : 'tasks'}],
    dailyList : [{type : mongoose.Schema.Types.ObjectId, ref : 'daily'}],
    expenseList : [{type : mongoose.Schema.Types.ObjectId, ref : 'expense'}],
    trackerList : {type : Array, default : ['Other']},
});

const Users = mongoose.model('users', userSchema, 'users');

module.exports = {Users};
