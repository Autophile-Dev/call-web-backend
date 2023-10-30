const express = require('express');
const router = express.Router();
const DateRecord = require('../models/DateRecord');
const cron = require('node-cron');
const moment = require('moment-timezone');
require('dotenv').config();


cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        const dateRecord = new DateRecord({
            createdDate: today,
            totalLeads: 0,
            totalAcceptedLeads: 0,
            totalRejectedLeads: 0,
            totalPendingLeads: 0,
        });
        await dateRecord.save();
        console.log(`Daily record created at ${today} `);
    } catch (error) {
        console.error('Failed to create record at 12 AM', error);
    }
});
router.post('/create-date-record', async (req, res) => {
    try {
        const inputDate = new Date(req.body.createdDate);

        // Check if the inputDate is a valid date
        if (isNaN(inputDate)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const inputDateWithoutTime = new Date(
            inputDate.getFullYear(),
            inputDate.getMonth(),
            inputDate.getDate()
        );

        // Check if a record with the same date (ignoring time) already exists
        const existingRecord = await DateRecord.findOne({
            createdDate: inputDateWithoutTime,
        });

        if (existingRecord) {
            return res
                .status(400)
                .json({ error: 'Record for this date already exists' });
        }

        const dateRecord = new DateRecord({
            createdDate: inputDateWithoutTime,
            totalLeads: 0,
            totalAcceptedLeads: 0,
            totalRejectedLeads: 0,
            totalPendingLeads: 0,
        });

        await dateRecord.save();
        console.log(`Date record created for ${inputDateWithoutTime}`);
        res.json(dateRecord);
    } catch (error) {
        console.error('Failed to create date record', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
router.get('/single-date-record/:id', async (req, res) => {
    try {
        const dateId = req.params.id;
        const date = await DateRecord.findById(dateId);
        if (!date) {
            return res.status(404).json({ message: 'Date not found' });
        }
        res.status(200).json({ date });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
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


router.get('/check-date-record', async (req, res) => {
    const createdDate = req.query.createdDate;

    try {
        const existingRecord = await DateRecord.findOne({ createdDate });

        if (existingRecord) {
            return res.json({ recordExists: true });
        } else {
            return res.json({ recordExists: false });
        }
    } catch (error) {
        console.error('Error checking date record:', error);
        return res.status(500).json({ error: 'Server Error' });
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