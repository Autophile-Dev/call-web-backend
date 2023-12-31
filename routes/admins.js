const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const AdminTheme = require('../models/AdminTheme');

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


        const adminTheme = new AdminTheme({
            adminId: newAdmin._id,
            sideBarBackground: '#f1f1f1', // Empty string
            sideBarIconTextColor: '#5f5f5f',
            sideBarHoverTextIconColor: '#5F5F5F',
            sideBarHoverBackgroundColor: 'rgba(255,255,255,0.3)',
            headerBackgroundColor: '#f8f8f8',
            headerTextColor: '#0d2444',
            defaultButtonBackgroundColor: '#30507c',
            addNewBackgroundColor: '#3ac47d',
            exportsBackgroundColor: '#071529',
            defaultButtonsTextColor: '#ffffff',
            addNewTextColor: '#ffffff',
            exportsTextColor: '#ffffff',
            defaultButtonHoverBackgroundColor: '#071529',
            addNewHoverBackgroundColor: '#25a362',
            exportHoverBackgroundColor: '#30507c',
            defaultButtonHoverTextColor: '#ffffff',
            addNewHoverTextColor: '#ffffff',
            exportHoverTextColor: '#ffffff',
        });
        await adminTheme.save();

        const token = jwt.sign({ _id: Admin._id }, process.env.JWT_SECRET);

        return res.status(200).send({ admin: newAdmin, adminTheme: adminTheme, token });
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
            return res.status(400).send({ message: `Admin Doesn't exists` });
        }
        // compare password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).send({ message: 'Password is incorrect' });
        }

        admin.loginCount += 1;
        await admin.save();
        const adminTheme = await AdminTheme.findOne({ adminId: admin._id });


        // Assigning token
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
        return res.status(200).send({ admin: admin, adminTheme: adminTheme, token })
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

router.delete('/delete-admin/:id', async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await Admin.findOneAndDelete({ _id: adminId });
        const deletedAdminTheme = await AdminTheme.findOneAndDelete(adminId);
        if (!deletedAdmin && !deletedAdminTheme) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/update-button/:id', async (req, res) => {
    try {
        const adminID = req.params.id
        const {
            defaultButtonBackgroundColor,
            addNewBackgroundColor,
            exportsBackgroundColor,
            defaultButtonsTextColor,
            addNewTextColor,
            exportsTextColor,
            defaultButtonHoverBackgroundColor,
            addNewHoverBackgroundColor,
            exportHoverBackgroundColor,
            defaultButtonHoverTextColor,
            addNewHoverTextColor,
            exportHoverTextColor
        } = req.body;
        const adminTheme = await AdminTheme.findOne({ adminId: adminID });
        if (!adminTheme) {
            return res.status(404).json({ message: 'Admin does not exists' });
        }
        adminTheme.defaultButtonBackgroundColor = defaultButtonBackgroundColor;
        adminTheme.addNewBackgroundColor = addNewBackgroundColor;
        adminTheme.exportsBackgroundColor = exportsBackgroundColor;
        adminTheme.defaultButtonsTextColor = defaultButtonsTextColor;
        adminTheme.addNewTextColor = addNewTextColor;
        adminTheme.exportsTextColor = exportsTextColor;
        adminTheme.defaultButtonHoverBackgroundColor = defaultButtonHoverBackgroundColor;
        adminTheme.addNewHoverBackgroundColor = addNewHoverBackgroundColor;
        adminTheme.exportHoverBackgroundColor = exportHoverBackgroundColor;
        adminTheme.defaultButtonHoverTextColor = defaultButtonHoverTextColor;
        adminTheme.addNewHoverTextColor = addNewHoverTextColor;
        adminTheme.exportHoverTextColor = exportHoverTextColor;

        await adminTheme.save();
        return res.status(200).json({ message: 'Button themes updated successfully', adminTheme });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Update sidebar
router.put('/update-sidebar/:id', async (req, res) => {
    try {
        const adminID = req.params.id;
        const {
            sideBarBackground,
            sideBarIconTextColor,
            sideBarHoverTextIconColor,
            sideBarHoverBackgroundColor
        } = req.body;
        const adminTheme = await AdminTheme.findOne({ adminId: adminID });
        if (!adminTheme) {
            return res.status(404).json({ message: 'Admin does not exists' });
        }
        adminTheme.sideBarBackground = sideBarBackground;
        adminTheme.sideBarIconTextColor = sideBarIconTextColor;
        adminTheme.sideBarHoverTextIconColor = sideBarHoverTextIconColor;
        adminTheme.sideBarHoverBackgroundColor = sideBarHoverBackgroundColor;
        await adminTheme.save();
        return res.status(200).json({ message: 'Sidebar themes updated successfully', adminTheme });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update-header/:id', async (req, res) => {
    try {
        const adminID = req.params.id;
        const {
            headerBackgroundColor,
            headerTextColor,
        } = req.body;
        const adminTheme = await AdminTheme.findOne({ adminId: adminID });
        if (!adminTheme) {
            return res.status(404).json({ message: 'Admin does not exists' });
        }
        adminTheme.headerBackgroundColor = headerBackgroundColor;
        adminTheme.headerTextColor = headerTextColor;
        adminTheme.save();
        return res.status(200).json({ message: 'Header themes updated successfully', adminTheme });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;