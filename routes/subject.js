const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Category = require('../models/Category');

// GET all subjects
router.get('/', async (req, res) => {
    try {
        const { semester, title } = req.query;
        let query = {};
        if (semester) query.semester = semester;
        if (title) query.title = title;
        const subjects = await Subject.find(query).sort({ order: 1, title: 1 });
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single subject
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new subject
router.post('/', async (req, res) => {
    const { title, semester, order } = req.body;
    try {
        const newSubject = new Subject({ title, semester, order });
        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// PUT update subject
router.put('/:id', async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE subject
router.delete('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        // Find all modules of this subject
        const modules = await Module.find({ subject: req.params.id });
        const moduleIds = modules.map(m => m._id);

        // Delete all categories in those modules
        await Category.deleteMany({ module: { $in: moduleIds } });

        // Delete all modules
        await Module.deleteMany({ subject: req.params.id });

        // Delete the subject
        await Subject.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Subject and all associated modules/questions deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
