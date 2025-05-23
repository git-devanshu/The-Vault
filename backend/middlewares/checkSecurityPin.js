const {Users} = require('../models/users');
const bcrypt = require('bcryptjs');

const checkSecurityPin = async(req, res, next) =>{
    try{
        const securityPin = req.headers['x-securitypin'];
        if(!securityPin){
            return res.status(400).json({ message : 'Security pin invalid' });
        }

        const user = await Users.findById(req.id);
        if(!user){
            return res.status(400).json({ message : 'Security pin invalid' });
        }

        const matched = await bcrypt.compare(securityPin, user.securityPin);
        if(!matched){
            return res.status(400).json({ message : 'Security pin invalid' });
        }

        next();
    }
    catch(error){
        res.status(400).json({ message : 'Security pin invalid' });
    }
}

module.exports = {checkSecurityPin};