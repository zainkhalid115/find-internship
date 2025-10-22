require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path'); // Required for path.join

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/db');

// Connect to MongoDB
mongoose.connect(db.mongoURI) // Removed deprecated options
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB connection error:', err)); // Changed console.log to console.error for errors

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views directory using path.join

// Express body parser
app.use(express.urlencoded({ extended: false })); // Use extended: false for basic form parsing

// Static folder
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // Used by Passport for login errors
    next();
});

// Routes
app.use('/', require('./routes/index')); // Handles welcome and dashboard
app.use('/auth', require('./routes/auth')); // Handles login, register, logout
app.use('/internships', require('./routes/internships'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));