const {Users} = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendSignupMail, sendVFCodeMail} = require('../utils/sendEmail');
const {generateVerificationCode} = require('../utils/helperFunctions');
require('dotenv').config();


// @route - POST /api/auth/signup
const signupUser = async(req, res) =>{
    try{
        const {email, name, password, securityPin} = req.body;
        if(!email || !name || !password || !securityPin){
            return res.status(400).json({ message : "All fields are required" });
        }

        const existingUser = await Users.findOne({email});
        if(existingUser){
            return res.status(400).json({ message : "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecurityPin = await bcrypt.hash(securityPin, 10);
        const newUser = new Users({
            name,
            email,
            password : hashedPassword,
            securityPin : hashedSecurityPin
        });
        await newUser.save();

        sendSignupMail(email, name);
        res.status(201).json({ message : "User registered successfuly" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @desc - reset your security pin
// @route - POST /api/auth/reset-security-pin
const resetSecurityPin = async(req, res) =>{
    try{
        const {securityPin, password} = req.body;
        if(!securityPin || !password){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const matched = await bcrypt.compare(password, user.password);
        if(!matched){
            return res.status(400).json({ message : "Invalid password" });
        }

        const hashedSecurityPin = await bcrypt.hash(securityPin, 10);
        user.securityPin = hashedSecurityPin;
        await user.save();
        res.status(200).json({ message : "Security pin changed"});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/auth/check-security-pin
const checkSecurityPin = async(req, res) =>{
    try{
        const {securityPin} = req.body;
        if(!securityPin){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const matched = await bcrypt.compare(securityPin, user.securityPin);
        if(!matched){
            return res.status(400).json({ message : "Invalid security pin" });
        }

        res.status(200).json({ message : "Security pin verified"});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/auth/login
const loginUser = async(req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ message : "All fields are required" });
        }

        const existingUser = await Users.findOne({email});
        if(!existingUser){
            return res.status(404).json({ message : "User not found" });
        }

        const matched = await bcrypt.compare(password, existingUser.password);
        if(!matched){
            return res.status(400).json({ message : "Invalid password" });
        }

        const token = jwt.sign({id : existingUser._id, email : existingUser.email, name : existingUser.name}, process.env.JWT_SECRET);
        res.status(200).json({ message : "Login successful", token });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/auth/get-vfcode
const getVfCode = async(req, res) =>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findOne({email});
        if(!user){
            return res.status(404).json({ message : 'User not found'});
        }

        const vfcode = generateVerificationCode(6);
        user.vfcode = vfcode;
        await user.save();

        sendVFCodeMail(email, vfcode);
        res.status(200).json({ message : 'Verification code sent your email address'});
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/auth/verify-vfcode
const verifyVfCode = async(req, res) =>{
    try{
        const {vfcode, email} = req.body;
        if(!email || !vfcode){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findOne({email});
        if(!user){
            return res.status(404).json({ message : 'User not found'});
        }
        
        if(user.vfcode == vfcode){
            res.status(200).json({ message : 'Verification Successful'});
        }
        else{
            res.status(403).json({ message : 'Invalid verification code'});
        }
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/auth/reset-password
const resetPassword = async(req, res) =>{
    try{
        const {newPassword, email, vfcode} = req.body;
        if(!email || !vfcode || !newPassword){
            return res.status(400).json({ message : "All fields are required" });
        }

        const user = await Users.findOne({email});
        if(!user){
            return res.status(404).json({ message : 'User not found'});
        }

        if(user.vfcode === vfcode){
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.vfcode = "0";
            await user.save();
            res.status(200).json({ message : 'Password reset successful'});
        }
        else{
            res.status(400).json({ message : "Invalid Request" });
        }
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}


module.exports = {
    signupUser,
    resetSecurityPin,
    checkSecurityPin,
    loginUser,
    getVfCode,
    verifyVfCode,
    resetPassword
};
