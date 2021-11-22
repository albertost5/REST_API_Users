// MODULES
const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const courses = require('./routes/courses');
const auth = require('./routes/auth');



// DB CONNECTION
dbConnection().catch((err) => console.log(`MongoDB's connection failed.`));

// EXPRESS INSTANCE
const app = express();

// MIDDLEWARES => app.use( function (error, req, res, next))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/login', auth);

// APP PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Running REST API Users..`);
});

async function dbConnection(){
    await mongoose.connect('mongodb://localhost:27017/demo');
    console.log('Connection successfully to MongoDB.');
}