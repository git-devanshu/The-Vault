const express = require('express');
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {checkSecurityPin} = require('../middlewares/checkSecurityPin');
const {getAllDailyNotes, addDailyNote, removeDailyNote, updateDailyNote} = require('../controllers/dailyControllers');

// endpoint prefix : /api/daily

const dailyRouter = express.Router();

dailyRouter.get('/', [checkAuthorization, checkSecurityPin], getAllDailyNotes);
dailyRouter.post('/', [checkAuthorization, checkSecurityPin], addDailyNote);
dailyRouter.put('/', [checkAuthorization, checkSecurityPin], updateDailyNote);
dailyRouter.delete('/:id', [checkAuthorization, checkSecurityPin], removeDailyNote);

module.exports = {dailyRouter};