const {Daily} = require('../models/daily');
const {Users} = require('../models/users');

// @route - GET /api/daily
const getAllDailyNotes = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/daily
const addDailyNote = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - PUT /api/daily
const updateDailyNote = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETET /api/daily/:id
const removeDailyNote = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}


module.exports = {
    getAllDailyNotes,
    addDailyNote,
    updateDailyNote,
    removeDailyNote
};