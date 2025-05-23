const {Notes} = require('../models/notes');
const {Users} = require('../models/users');

// @route - GET /api/notes
const getAllNotes = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/notes
const addNotes = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - PUT /api/notes
const updateNotes = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/notes/:id
const removeNotes = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

module.exports = {
    addNotes,
    getAllNotes,
    removeNotes,
    updateNotes
};