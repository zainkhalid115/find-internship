const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { ensureAuthenticated } = require('../middleware/auth'); // To protect routes later

// @route   GET /internships
// @desc    View all internships
router.get('/', internshipController.getInternships);

// @route   GET /internships/add
// @desc    Show form to add new internship (Protected route - only logged in users can add)
router.get('/add', ensureAuthenticated, internshipController.getAddInternshipPage);

// @route   POST /internships
// @desc    Handle adding new internship (Protected route)
router.post('/', ensureAuthenticated, internshipController.addInternship);

// @route   GET /internships/:id
// @desc    View single internship
router.get('/:id', internshipController.getInternshipById);

// Add routes for edit/update/delete later
// router.get('/edit/:id', ensureAuthenticated, internshipController.getEditInternshipPage);
// router.put('/:id', ensureAuthenticated, internshipController.updateInternship); // Needs method-override for PUT/DELETE forms
// router.delete('/:id', ensureAuthenticated, internshipController.deleteInternship); // Needs method-override

module.exports = router;