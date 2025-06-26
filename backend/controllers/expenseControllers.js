const {Expense} = require('../models/expense');
const {Users} = require('../models/users');

// @route - GET /api/expense/:tracker
const getExpensesByTracker = async(req, res) =>{
    try{
        const tracker = req.params.tracker;
        const user = await Users.findById(req.id).populate({
            path: 'expenseList',
            match: { trackerName: tracker },
            options: { sort: { spentOnDate: -1 } }
        });
        
        if(!user){
            return res.status(404).json({ message : "Data not found" });
        }
        const expenseData = user.expenseList;
        const totalExpense = expenseData.reduce((sum, exp) => sum + exp.amount, 0);

        res.status(200).json({expenseData, totalExpense});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/expense
const addExpense = async(req, res) =>{
    try{
        const {amount, spentAt, spentOnDate, trackerName} = req.body;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const newExpense = await Expense.create({
            amount, 
            spentAt, 
            spentOnDate: new Date(spentOnDate), 
            trackerName
        });
        user.expenseList.push(newExpense._id);
        await user.save();
        res.status(200).json({ message : "Expense added" })
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/expense/:id
const removeExpense = async(req, res) =>{
    try{
        const id = req.params.id;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const removedExpense = await Expense.findByIdAndDelete(id);
        if(!removedExpense){
            return res.status(404).json({ message : "Expense not found" });
        }
        res.status(200).json({ message : "Expense removed" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - GET /api/expense/tracker-data
const getAllTrackers = async(req, res) =>{
    try{
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        const data = user.trackerList;
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/expense/tracker-data
const addTracker = async(req, res) =>{
    try{
        const {trackerName} = req.body;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        user.trackerList.push(trackerName);
        await user.save();
        res.status(200).json({ message : "Tracker created" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/expense/tracker-data/:trackerName
const removeTracker = async(req, res) =>{
    try{
        const trackerName = req.params.trackerName;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        user.trackerList = user.trackerList.filter(val => val !== trackerName);
        await user.save();
        res.status(200).json({ message : "Tracker removed" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

module.exports = {
    addExpense,
    getExpensesByTracker,
    removeExpense,
    getAllTrackers,
    addTracker,
    removeTracker
};