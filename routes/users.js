const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');


const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();


router.post('/create-user', async (req, res) => {
  try {
    // Code to register a new user based on req.body
    const { firstName, lastName, email, phoneNum, address, city, dob, password } = req.body;

    // check if email exists or not 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Remember to hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // create a new admin
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNum,
      address,
      city,
      dob,
      createdAt: new Date(),
      password: hashedPassword,
    });
    await newUser.save();

    // const token = jwt.sign({ _id: User._id }, process.env.JWT_SECRET);

    return res.status(200).send({ cmpUser: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server Error' });
  }
});


router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: `User Doesn't Exist` });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    // Assigning a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ cmpUser: user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


