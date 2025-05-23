const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// import routers
const {authRouter} = require('./routers/authRouter');
const {dailyRouter} = require('./routers/dailyRouter');
const {notesRouter} = require('./routers/notesRouter');
const {passwordRouter} = require('./routers/passwordRouter');
const {taskRouter} = require('./routers/taskRouter');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


// database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected to Database');
})
.catch(err =>{
    console.log('Error connecting to Database', err);
})


// use routers
app.use('/api/auth', authRouter);
app.use('/api/daily', dailyRouter);
app.use('/api/notes', notesRouter);
app.use('/api/password', passwordRouter);
app.use('/api/task', taskRouter);


app.listen(process.env.PORT, ()=>{
    console.log('Server is listening on PORT', process.env.PORT);
});