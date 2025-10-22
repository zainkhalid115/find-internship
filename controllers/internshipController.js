const Internship = require('../models/Internship'); // Load Internship Model

// @desc    Get all internships
// @route   GET /internships
exports.getInternships = async (req, res) => {
    try {
        const internships = await Internship.find().populate('postedBy', 'username').sort({ datePosted: -1 });
        res.render('internships/index', { // Render the list of internships
            internships: internships,
            // Pass flash messages to the view
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Could not retrieve internships.');
        res.redirect('/'); // Redirect to home or handle error
    }
};

// @desc    Get single internship by ID
// @route   GET /internships/:id
exports.getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate('postedBy', 'username');
        if (!internship) {
            req.flash('error_msg', 'Internship not found.');
            return res.redirect('/internships');
        }
        res.render('internships/show', { // Render single internship details
            internship: internship,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Could not retrieve internship details.');
        res.redirect('/internships');
    }
};

// @desc    Show form to add new internship
// @route   GET /internships/add
exports.getAddInternshipPage = (req, res) => {
    res.render('internships/add', {
        // Pass flash messages to the view
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
        error: req.flash('error')
    });
};

// @desc    Add new internship
// @route   POST /internships
exports.addInternship = async (req, res) => {
    const { title, company, location, description, requirements, applicationLink } = req.body;
    let errors = [];

    // Basic validation (you can expand this)
    if (!title || !company || !location || !description || !applicationLink) {
        errors.push({ msg: 'Please fill in all required fields.' });
    }
    if (!applicationLink.match(/^https?:\/\/.+/)) {
        errors.push({ msg: 'Please provide a valid application URL.' });
    }

    if (errors.length > 0) {
        return res.render('internships/add', {
            errors,
            title, company, location, description, requirements, applicationLink
        });
    }

    try {
        const newInternship = new Internship({
            title,
            company,
            location,
            description,
            // Requirements need to be parsed from the form (e.g., comma-separated string)
            // For now, let's assume it's a string that we split. Better would be multiple input fields.
            requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
            applicationLink,
            postedBy: req.user ? req.user.id : null // Assign to logged-in user, if any
        });

        await newInternship.save();
        req.flash('success_msg', 'Internship added successfully!');
        res.redirect('/internships');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding internship.');
        res.render('internships/add', {
            error_msg: 'Error adding internship. Please try again.',
            title, company, location, description, requirements, applicationLink // Repopulate form
        });
    }
};

// You can add update and delete functions here later
// For example:
/*
// @desc    Show form to edit existing internship
// @route   GET /internships/edit/:id
exports.getEditInternshipPage = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            req.flash('error_msg', 'Internship not found.');
            return res.redirect('/internships');
        }
        // Add authorization check here: if (internship.postedBy.toString() !== req.user.id) ...
        res.render('internships/edit', { internship }); // You'd create 'internships/edit.ejs'
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Could not retrieve internship for editing.');
        res.redirect('/internships');
    }
};

// @desc    Update existing internship
// @route   PUT /internships/:id
exports.updateInternship = async (req, res) => {
    // Logic for updating internship
};

// @desc    Delete internship
// @route   DELETE /internships/:id
exports.deleteInternship = async (req, res) => {
    // Logic for deleting internship
};
*/