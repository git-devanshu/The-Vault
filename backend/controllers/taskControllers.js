const {Tasks} = require('../models/tasks');
const {Users} = require('../models/users');

// @route - GET /api/task
const getAllTasks = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/task
const addTask = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/task/:id
const removeTask = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/task/change-status
const changeTaskStatus = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}


module.exports = {
    addTask,
    getAllTasks,
    removeTask,
    changeTaskStatus
};