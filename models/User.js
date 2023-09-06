const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    phoneNum: String,
    password: String,
    userImage: String,
    address: String,
    city: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;