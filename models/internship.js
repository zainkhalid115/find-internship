const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String], // Array of strings for requirements
        default: []
    },
    applicationLink: {
        type: String,
        required: true,
        trim: true,
        match: [/^https?:\/\/.+/, 'Please use a valid URL for the application link'] // Basic URL validation
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User who posted it
        ref: 'User'
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});

const Internship = mongoose.model('Internship', InternshipSchema);

module.exports = Internship;