const express = require('express');
const {signupUser, loginUser, getVfCode, verifyVfCode, resetPassword, resetSecurityPin, checkSecurityPin} = require('../controllers/authControllers');
const {checkAuthorization} = require('../middlewares/checkAuthorization');

// endpoint prefix : /api/auth

const authRouter = express.Router();

authRouter.post('/signup', signupUser);
authRouter.post('/login', loginUser);

authRouter.post('/reset-security-pin', checkAuthorization, resetSecurityPin);
authRouter.post('/check-security-pin', checkAuthorization, checkSecurityPin);

authRouter.post('/get-vfcode', getVfCode);
authRouter.post('/verify-vfcode', verifyVfCode);
authRouter.post('/reset-password', resetPassword);

module.exports = {authRouter};
