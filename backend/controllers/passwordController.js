const {Passwords} = require('../models/passwords');
const {Users} = require('../models/users');
const {encryptData, decryptData} = require('../utils/helperFunctions');


// @route - POST /api/password/label
const createLabel = async(req, res) =>{
    try{
        const {label} = req.body;
        if(!label){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        if(user.passwordLabels.length >= 10){
            return res.status(400).json({ message : "Label creation limit reached" });
        }

        user.passwordLabels.push(label);
        await user.save();
        res.status(200).json({ message : "Label created" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/password/label/:labelName
const removeLabel = async(req, res) =>{
    try{
        const labelName = req.params.labelName;

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        user.passwordLabels = user.passwordLabels.filter(label => label != labelName);
        await user.save();
        res.status(200).json({ message : "Label removed" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/password
const addPassword = async(req, res) =>{
    try{
        const {platform, username, password, label} = req.body;
        if(!platform || !username || !password || !label){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const encryptedPassword = encryptData(password);
        const encryptedUsername = encryptData(username);
        const newPassword = await Passwords.create({
            platform,
            username : encryptedUsername,
            password : encryptedPassword,
            label
        });

        user.passwordList.push(newPassword._id);
        await user.save();
        res.status(200).json({message : 'Password saved'});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - PUT /api/password
const updatePassword = async(req, res) =>{
    try{
        const {id, platform, username, password, label} = req.body; //username and password should be plain text not encrypted
        if(!id || !platform || !username || !password || !label){
            return res.status(400).json({ message : "All fields are required" });
        }

        const encryptedPassword = encryptData(password);
        const encryptedUsername = encryptData(username);
        const updatedPass = await Passwords.findByIdAndUpdate(id, {
            platform, 
            username : encryptedUsername,
            password : encryptedPassword,
            label
        });
        if(!updatedPass){
            return res.status(404).json({ message : "Password data not found" });
        }
        res.status(200).json({ message : "Password updated" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/password/:id
const removePassword = async(req, res) =>{
    try{
        const id = req.params.id;

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const removedPass = await Passwords.findByIdAndDelete(id);
        if(!removedPass){
            return res.status(404).json({ message : "Password data not found" });
        }

        user.passwordList = user.passwordList.filter(passId => passId !== id);
        await user.save();
        res.status(200).json({message : 'Password deleted'});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - GET /api/password/:id
const revealPassword = async(req, res) =>{
    try{
        const id = req.params.id;
        const passwordData = await Passwords.findById(id);
        if(!passwordData){
            return res.status(404).json({ message : "Password data not found" });
        }

        const decryptedUsername = decryptData(passwordData.username);
        const decryptedPassword = decryptData(passwordData.password);

        res.status(200).json({platform : passwordData.platform,decryptedUsername, decryptedPassword});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - GET /api/password
const getAllPasswords = async(req, res) =>{
    try{
        const user = await Users.findById(req.id).populate('passwordList');
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        const data = user.passwordList;
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - GET /api/password/label
const getAllLabels = async(req, res) =>{
    try{
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        const data = user.passwordLabels;
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

module.exports = {
    createLabel,
    removeLabel,
    getAllLabels,
    addPassword,
    removePassword,
    updatePassword,
    getAllPasswords,
    revealPassword
}