const mongoose = require('mongoose');
const DateRecordSchema = new mongoose.Schema({
    createdDate: Date,
    totalLeads: String,
    totalAcceptedLeads: String,
    totalRejectedLeads: String,
    totalPendingLeads: String,
});

const DateRecord = mongoose.model('DateRecord', DateRecordSchema);
module.exports = DateRecord;