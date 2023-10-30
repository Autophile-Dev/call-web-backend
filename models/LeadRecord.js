const mongoose = require('mongoose');
const leadRecordSchema = new mongoose.Schema({
    dateID: String,
    employeeID: String,
    employeeFirstName: String,
    employeeLastName: String,
    employeeImage: String,
    createdAt: {
        type: Date,
        required: true,
    },
    createdTime: {
        type: Date,
        required: true,
    },
    leadTitle: String,
    customerName: String,
    customerAddress: String,
    customerEmail: String,
    customerPhoneNum: String,
    leadStatus: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending',
    },
});

const LeadRecord = mongoose.model('LeadRecord', leadRecordSchema);
module.exports = LeadRecord;