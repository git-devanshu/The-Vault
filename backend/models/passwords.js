const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    platform : {type : String, required : true},
    username : {type : String, required : true},
    password : {type : String, required : true},
    label : {type : String, required : true}
});

const Passwords = mongoose.model('passwords', passwordSchema, 'passwords');

module.exports = {Passwords};
