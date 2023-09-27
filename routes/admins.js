const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");

router.post('/admin-register', async (req, res) => {
    try {
        // Code to register a new user based on req.body
        const { firstName, lastName, email, phoneNum, dob, password } = req.body;

        // check if email exists or not 
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Remember to hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // create a new admin
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            phoneNum,
            dob,
            password: hashedPassword,
        });
        await newAdmin.save();

        const token = jwt.sign({ _id: Admin._id }, process.env.JWT_SECRET);

        return res.status(200).send({ admin: newAdmin, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server Error' });
    }
});
// Login admin with authentication and web token
router.post('/admin-login', async (req, res) => {
    try {
        // Perform user login and generate a JWT Token
        const { email, password } = req.body;
        // check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).send({ message: `User Doesn't exists` });
        }
        // compare password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).send({ message: 'Password is incorrect' });
        }
        // Assigning token
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
        return res.status(200).send({ admin: admin, token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

// update basic profile
router.put('/update-admin-basic/:id', upload.single('profileImage'), async (req, res) => {
    try {
        const adminId = req.params.id;
        const { firstName, lastName, phoneNum, dob } = req.body;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if an image was uploaded
        let userProfileImageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'admin-profile',
            });
            userProfileImageUrl = result.secure_url;
        }
        admin.firstName = firstName;
        admin.lastName = lastName;
        admin.phoneNum = phoneNum;
        admin.dob = dob;
        admin.profileImage = userProfileImageUrl;
        await admin.save();
        res.status(200).json({ message: 'Admin updated successfully', updateAdmin: admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/admin/:id', async (req, res) => {
    try {
        const adminId = req.params.id;
        const adminSingle = await Admin.findById(adminId);
        if (!adminSingle) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ adminSingle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// update password from inside the app
router.put('/update-admin-password/:id', async (req, res) => {
    try {
        const adminId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid old password' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedNewPassword;
        await admin.save();
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;