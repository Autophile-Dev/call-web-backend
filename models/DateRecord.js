const mongoose = require('mongoose');
const dateRecordSchema = new mongoose.Schema({
    createdDate: {
        type: Date,
        required: true,
        unique: true, // Ensure that dates are unique, so no duplicate dates can be added.
    },
    totalLeads: {
        type: Number,
        default: 0,
    },
    totalAcceptedLeads: {
        type: Number,
        default: 0,
    },
    totalRejectedLeads: {
        type: Number,
        default: 0,
    },
    totalPendingLeads: {
        type: Number,
        default: 0,
    },
});

const DateRecord = mongoose.model('DateRecord', dateRecordSchema);
module.exports = DateRecord;