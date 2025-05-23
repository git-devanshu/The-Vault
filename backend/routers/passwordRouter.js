const express = require('express');
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {checkSecurityPin} = require('../middlewares/checkSecurityPin');
const {createLabel, removeLabel, addPassword, updatePassword, removePassword, getAllPasswords, getAllLabels, revealPassword} = require('../controllers/passwordController');

// endpoint prefix : /api/password

const passwordRouter = express.Router();

passwordRouter.get('/label', [checkAuthorization, checkSecurityPin], getAllLabels);
passwordRouter.post('/label', [checkAuthorization, checkSecurityPin], createLabel);
passwordRouter.delete('/label/:labelName', [checkAuthorization, checkSecurityPin], removeLabel);

passwordRouter.get('/', [checkAuthorization, checkSecurityPin], getAllPasswords);
passwordRouter.get('/:id', [checkAuthorization, checkSecurityPin], revealPassword);
passwordRouter.post('/', [checkAuthorization, checkSecurityPin], addPassword);
passwordRouter.put('/', [checkAuthorization, checkSecurityPin], updatePassword);
passwordRouter.delete('/:id', [checkAuthorization, checkSecurityPin], removePassword);

module.exports = {passwordRouter};