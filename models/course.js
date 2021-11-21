const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    status: {type: Boolean, default: true},
    image:  {type: String, required: false},
    students: {type: Number, default: 0},
    rating: {type: Number, default: 0}
});

module.exports = mongoose.model('Course', courseSchema);