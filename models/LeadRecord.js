const mongoose = require('mongoose');
const LeadRecordSchema = new mongoose.Schema({
    dateID: String,
    employeeID: String,
    employeeName: String,
    employeeImage: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdTime: {
        type: Date,
        default: Date.now,
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

const LeadRecord = mongoose.model('LeadRecord', LeadRecordSchema);
module.exports = LeadRecord;