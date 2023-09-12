// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const path = require('path');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// require('dotenv').config();


// cloudinary.config({
//     cloud_name: 'dmw2sruc5',
//     api_key: '817866735889511',
//     api_secret: 'UX4gUEZQeN_jKtD2ZNqa8BbXGU4'
// });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'user-images', // Optional: specify a folder in your Cloudinary account
//         allowedFormats: ['jpg', 'png', 'jpeg'],
//     },
// });

// const upload = multer({ storage });

// router.post('/create-user', upload.single('userImage'), async (req, res) => {
//     try {
//         const { firstName, lastName, email, phoneNum, password, address, city, dob } = req.body;

//         // Check if user exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         // Remember to hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const imageUrl = req.file?.path || '';

//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             phoneNum,
//             password: hashedPassword,
//             userImage: imageUrl, // Use req.file.path for the image path
//             address,
//             city,
//             dob
//         });
//         newUser.createdAt = new Date();

//         await newUser.save();
//         return res.status(200).send({ cmpUser: newUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


// router.post('/user-login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).send({ message: `User Doesn't Exists` });
//         }
//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(400).send({ message: 'Password is incorrect' });
//         }
//         // Assigning token
//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//         return res.status(200).send({ cmpUser: user, token })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary using your API credentials
cloudinary.config({
    cloud_name: 'dmw2sruc5',
    api_key: '817866735889511',
    api_secret: 'UX4gUEZQeN_jKtD2ZNqa8BbXGU4'
});




// Create a multer storage engine that uploads directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create-user', upload.single('userImage'), async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNum, password, address, city, dob } = req.body;
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Remember to hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Upload the image to Cloudinary
      const imageUploadResult = await cloudinary.uploader.upload(req.file.buffer.toString('base64'), {
        folder: 'user-images', // Optional: specify a folder in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg'],
      });
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNum,
        password: hashedPassword,
        userImage: imageUploadResult.secure_url,
        address,
        city,
        dob,
        createdAt: new Date(),
      });
  
      await newUser.save();
      
      // Send a simplified response with just user information
      return res.status(200).json({ message: 'User created successfully', cmpUser: { firstName, lastName, email, phoneNum, address, city, dob } });
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
