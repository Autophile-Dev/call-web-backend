const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },

});

const upload = multer({ storage });

router.post('/create-user', upload.single('userImage'), async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNum, password, address, city, userImage } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // remember to hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNum,
            password: hashedPassword,
            userImage,
            address,
            city
        });
        newUser.createdAt = new Date();

        await newUser.save();
        return res.status(200).send({ cmpUser: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});


router.post('/user-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: `User Doesn't Exists` });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: 'Password is incorrect' });
        }
        // Assigning token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        return res.status(200).send({ cmpUser: user, token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;