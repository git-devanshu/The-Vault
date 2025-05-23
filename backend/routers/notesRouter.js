const express = require('express');
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {checkSecurityPin} = require('../middlewares/checkSecurityPin');
const {getAllNotes, addNotes, removeNotes, updateNotes} = require('../controllers/notesControllers');

// endpoint prefix : /api/notes

const notesRouter = express.Router();

notesRouter.get('/', [checkAuthorization, checkSecurityPin], getAllNotes);
notesRouter.post('/', [checkAuthorization, checkSecurityPin], addNotes);
notesRouter.put('/', [checkAuthorization, checkSecurityPin], updateNotes);
notesRouter.delete('/:id', [checkAuthorization, checkSecurityPin], removeNotes);

module.exports = {notesRouter};
