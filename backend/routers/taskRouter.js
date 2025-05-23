const express = require('express');
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {checkSecurityPin} = require('../middlewares/checkSecurityPin');
const {addTask, removeTask, getAllTasks, changeTaskStatus} = require('../controllers/taskControllers');

// endpoint prefix : /api/task

const taskRouter = express.Router();

taskRouter.get('/', [checkAuthorization, checkSecurityPin], getAllTasks);
taskRouter.post('/', [checkAuthorization, checkSecurityPin], addTask);
taskRouter.delete('/:id', [checkAuthorization, checkSecurityPin], removeTask);

taskRouter.post('/change-status', [checkAuthorization, checkSecurityPin], changeTaskStatus);

module.exports = {taskRouter};