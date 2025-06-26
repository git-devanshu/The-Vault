const express = require('express');
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {checkSecurityPin} = require('../middlewares/checkSecurityPin');
const {addExpense, getExpensesByTracker, removeExpense, getAllTrackers, addTracker, removeTracker} = require('../controllers/expenseControllers');

// endpoint prefix : /api/expense

const expenseRouter = express.Router();

expenseRouter.get('/tracker-data', [checkAuthorization, checkSecurityPin], getAllTrackers);
expenseRouter.post('/tracker-data', [checkAuthorization, checkSecurityPin], addTracker);
expenseRouter.delete('/tracker-data/:trackerName', [checkAuthorization, checkSecurityPin], removeTracker);

expenseRouter.get('/:tracker', [checkAuthorization, checkSecurityPin], getExpensesByTracker);
expenseRouter.post('/', [checkAuthorization, checkSecurityPin], addExpense);
expenseRouter.delete('/:id', [checkAuthorization, checkSecurityPin], removeExpense);

module.exports = {expenseRouter};