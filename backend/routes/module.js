const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

// GET all modules for a subject
router.get('/', async (req, res) => {
    try {
        const { subjectId } = req.query;
        let query = {};
        if (subjectId) query.subject = subjectId;
        const modules = await Module.find(query).sort({ order: 1, title: 1 });
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single module
router.get('/:id', async (req, res) => {
    try {
        const moduleItem = await Module.findById(req.params.id);
        if (!moduleItem) return res.status(404).json({ message: 'Module not found' });
        res.status(200).json(moduleItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new module
router.post('/', async (req, res) => {
    const { title, subject, order } = req.body;
    try {
        const newModule = new Module({ title, subject, order });
        const savedModule = await newModule.save();
        res.status(201).json(savedModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update module
router.put('/:id', async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedModule) return res.status(404).json({ message: 'Module not found' });
        res.status(200).json(updatedModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const Category = require('../models/Category');

// DELETE module and its categories
router.delete('/:id', async (req, res) => {
    try {
        const moduleId = req.params.id;

        // Delete all categories associated with this module
        await Category.deleteMany({ module: moduleId });

        // Delete the module
        const deletedModule = await Module.findByIdAndDelete(moduleId);

        if (!deletedModule) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json({ message: "Module and associated questions deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
