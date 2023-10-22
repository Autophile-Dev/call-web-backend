const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    // Admin properties here
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    phoneNum: String,
    dob: String,
    password: String,
    profileImage: String,
    loginCount: {
        type: Number,
        default: 0,
    },
});
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;