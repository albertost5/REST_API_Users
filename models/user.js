const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    password: { type: String, required: true},
    status: { type: Boolean, default: true},
    image: { type: String, required: false},
    role: { type: String, enum: ['ROLE_USER', 'ROLE_ADMIN'], default: 'ROLE_USER' }
});

module.exports = mongoose.model('User', userSchema);