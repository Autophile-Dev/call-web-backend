const express = require('express');
const router = express.Router();
const LeadRecord = require('../models/LeadRecord');
const NewCustomer = require('../models/NewCustomers');
const CustomerRecord = require('../models/CustomersRecord');
require('dotenv').config();

router.post('/create-lead-record/:id', async (req, res) => {
    try {
        const dateID = req.params.id;
        const {
            employeeID,
            employeeFirstName,
            employeeLastName,
            employeeImage,
            leadTitle,
            customerName,
            customerAddress,
            customerEmail,
            customerPhoneNum
        } = req.body;
        const currentDate = new Date();
        const dateWithoutTime = new Date(currentDate.toISOString().split('T')[0]);
        // const timeWithoutDate = new Date(currentDate - dateWithoutTime);
        // Creating record in New Customer after validation
        const checkCustomer = await NewCustomer.findOne({ customerEmail });
        if (!checkCustomer) {
            const newCustomer = new NewCustomer({
                employeeID,
                employeeFirstName,
                employeeLastName,
                employeeImage,
                customerName,
                customerAddress,
                customerEmail,
                customerPhoneNum,
                createdAt: new Date(),
            });
            await newCustomer.save();
        }


        // Creating record of Customers either they exists before or not
        const customerRecord = new CustomerRecord({
            employeeID,
            employeeFirstName,
            employeeLastName,
            employeeImage,
            customerName,
            customerAddress,
            customerEmail,
            customerPhoneNum,
            createdAt: new Date(),
        });
        await customerRecord.save();


        // Creating record in Lead
        const newLead = new LeadRecord({
            dateID: dateID,
            employeeID,
            employeeFirstName,
            employeeLastName,
            employeeImage,
            leadTitle,
            customerName,
            customerAddress,
            customerEmail,
            customerPhoneNum,
            createdAt: dateWithoutTime,
            createdTime: new Date(),
        });
        await newLead.save();
        res.status(200).json({ message: 'Lead record created successfully', newLead });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server Error' });
    }
});
router.get('/fetch-records/:id', async (req, res) => {
    try {
        const dateID = req.params.id;
        const recordsLeads = await LeadRecord.findOne({ dateID });

        if (recordsLeads.length === 0) {
            return res.status(404).json({ message: 'No records found' });
        }

        res.status(200).json({ message: 'Records fetched successfully', records:recordsLeads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;