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
        const dateWithoutTime = new Date(currentDate.toISOString().split('T')[0]); // Get date without time
        const timeWithoutDate = new Date(currentDate.toISOString().split('T')[1]); // Get time without date


        // Creating record in New Customer after validation
        const checkCustomer = await NewCustomer.findOne({ customerEmail });
        if (!checkCustomer) {
            const newCustomer = new NewCustomer({
                customerName,
                customerAddress,
                customerEmail,
                customerPhoneNum,
                createdAt: dateWithoutTime,
            });
            await newCustomer.save();
        }


        // Creating record of Customers either they exists before or not
        const customerRecord = new CustomerRecord({
            customerName,
            customerAddress,
            customerEmail,
            customerPhoneNum,
            createdAt: dateWithoutTime,
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
            createdTime: timeWithoutDate,
        });
        await newLead.save();
        res.status(200).json({ message: 'Lead record created successfully', newLead });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server Error' });
    }
})

module.exports = router;