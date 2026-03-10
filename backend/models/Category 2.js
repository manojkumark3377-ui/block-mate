const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Category title is required'],
        trim: true,
        unique: true
    },
    desc: {
        type: String,
        trim: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
