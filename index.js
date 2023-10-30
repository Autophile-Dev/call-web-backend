const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const adminAuthRoutes = require('./routes/admins');
const userRoutes = require('./routes/users');
const dateRoutes = require('./routes/dateRecord');
const leadRoutes = require('./routes/leadRecord');
const app = express();
const port = process.env.PORT;
const mongodbURI = process.env.MONGODB_URI;

// Middleware to parse incoming JSON data
app.use(cors());
app.use(express.json());

// Connect to MONGODB
mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});

// Routes
app.use('/auth/admin', adminAuthRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/auth/date-records', dateRoutes);
app.use('/auth/lead-records', leadRoutes);
app.use('/auth/users', userRoutes);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});