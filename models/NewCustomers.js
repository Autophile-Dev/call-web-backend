const mongoose = require('mongoose');
const newCustomerSchema = new mongoose.Schema({
    employeeID: String,
    employeeFirstName: String,
    employeeLastName: String,
    employeeImage: String,
    customerName: String,
    customerAddress: String,
    customerEmail: String,
    customerPhoneNum: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const NewCustomerRecord = mongoose.model('NewCustomerRecord', newCustomerSchema);
module.exports = NewCustomerRecord;