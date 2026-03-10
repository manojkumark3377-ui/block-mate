const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Subject title is required'],
        trim: true,
        unique: true
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    files: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
