const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User Model
const User = require('../models/User');

// @desc    Show login page
// @route   GET /auth/login
exports.getLoginPage = (req, res) => {
    res.render('login');
};

// @desc    Show register page
// @route   GET /auth/register
exports.getRegisterPage = (req, res) => {
    res.render('register');
};

// @desc    Register new user
// @route   POST /auth/register
exports.registerUser = (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        username,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        username,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.error('Bcrypt hashing error:', err);
                                req.flash('error_msg', 'Something went wrong during registration.');
                                return res.redirect('/auth/register');
                            }
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/auth/login');
                                })
                                .catch(err => {
                                    console.error('User save error:', err);
                                    req.flash('error_msg', 'Error saving user to database.');
                                    res.redirect('/auth/register');
                                });
                        });
                    });
                }
            })
            .catch(err => {
                console.error('User find error:', err);
                req.flash('error_msg', 'Something went wrong.');
                res.redirect('/auth/register');
            });
    }
};

// @desc    Authenticate user and log them in
// @route   POST /auth/login
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
};

// @desc    Log out current user
// @route   GET /auth/logout
exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
};