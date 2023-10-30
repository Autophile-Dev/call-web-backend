const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    phoneNum: String,
    profileImage: String,
    address: String,
    city: String,

    dob: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;