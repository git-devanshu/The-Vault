const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task : {type : String, required : true},
    completed : {type : Boolean, default : false},
    deadline : {type : String, required : true}
});

const Tasks = mongoose.model('tasks', taskSchema, 'tasks');

module.exports = {Tasks};
