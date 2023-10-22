const express = require('express');
const router = express.Router();
const DateRecord = require('../models/DateRecord');
const cron = require('node-cron');
require('dotenv').config();


cron.schedule('0 0 * * *', async () => {
    console.log('Cron job started at', new Date());

    // Set the timezone to 'Asia/Karachi' (Pakistan timezone)
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

    const newDateRecord = new DateRecord({
        createdDate: currentDate,
        totalLeads: '0',
        totalAcceptedLeads: '0',
        totalRejectedLeads: '0',
        totalPendingLeads: '0',
    });

    try {
        await newDateRecord.save();
        console.log('Record inserted into the database at', currentDate);
    } catch (error) {
        console.error('Error inserting record:', error);
    }
});
router.get('/all-date-records', async (req, res) => {
    try {
        const records = await DateRecord.find().sort({ createdDate: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/page-date-records', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sort = { createdDate: -1 };

    const skip = (page - 1) * limit;
    const query = {
        createdDate: { $regex: search, $options: 'i' }
    };
    try {
        const records = await DateRecord.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        const totalRecords = await DateRecord.countDocuments(query);
        res.json({ records, totalRecords });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;