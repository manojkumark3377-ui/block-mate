const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Module title is required'],
        trim: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
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

// Ensure (title, subject) uniqueness to prevent literal overlap
ModuleSchema.index({ title: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Module', ModuleSchema);
