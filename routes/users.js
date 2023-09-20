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

// Fetch all user according to pagination
router.get('/all-user', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const perPage = parseInt(req.query.perPage) || 10; // Records per page (default: 20)

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / perPage);

    const users = await User.find()
      .sort({ createdAt: -1 }) // Sort by createdAt field in ascending order
      .skip((page - 1) * perPage)
      .limit(perPage);
    const existUsingUsers = await User.find()
      .sort({ createdAt: -1 });
    res.json({ users, existUsingUsers, totalRecords: totalUsers, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export all record
router.get('/all-users-for-export', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 }); // Sort by createdAt field in ascending order

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete users
router.delete('/delete-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})


// Update user from admin panel
router.put('/update-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phoneNum, address, city, dob } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNum = phoneNum;
    user.address = address;
    user.city = city;
    user.dob = dob;
    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Single user
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID in the database
    const user = await User.findById(userId);

    // Check if the user with the specified ID exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;


