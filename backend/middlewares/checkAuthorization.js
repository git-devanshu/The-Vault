require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkAuthorization = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
        try{
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            if(!decoded.id || !decoded.email || !decoded.name){
                return res.status(401).json({ message : 'Authorization Error' });
            }
            req.id = decoded.id;
            req.email = decoded.email;
            req.name = decoded.name;
            next();
        }
        catch(error){
            res.status(401).json({ message : 'Authorization Error' });
        }
    }
    else{
        res.status(401).json({ message : 'Authorization Error' });
    }
}

module.exports = {checkAuthorization};
