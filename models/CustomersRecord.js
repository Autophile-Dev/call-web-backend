const mongoose = require('mongoose');
const customersRecordSchema = new mongoose.Schema({
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

const CustomerRecord = mongoose.model('CustomerRecord', customersRecordSchema);
module.exports = CustomerRecord;