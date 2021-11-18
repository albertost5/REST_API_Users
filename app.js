// MODULES
const express = require('express');
const mongoose = require('mongoose');


// DB CONNECTION
dbConnection().catch((err) => console.log(`MongoDB's connection failed.`));

// EXPRESS INSTANCE
const app = express();


// APP PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Running REST API Users..`);
});

async function dbConnection(){
    await mongoose.connect('mongodb://localhost:27017/demo');
    console.log('Connection successfully to MongoDB.');
}