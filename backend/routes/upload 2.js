const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Subject = require('../models/Subject');
const Module = require('../models/Module');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// POST upload file and attach to subject
router.post('/subject/:id', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const fileData = {
            name: req.body.name || req.file.originalname,
            url: `/uploads/${req.file.filename}`
        };

        subject.files.push(fileData);
        await subject.save();

        res.status(200).json({
            message: 'File uploaded and attached to subject',
            file: fileData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST upload file and attach to module
router.post('/module/:id', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const moduleItem = await Module.findById(req.params.id);
        if (!moduleItem) {
            return res.status(404).json({ message: 'Module not found' });
        }

        const fileData = {
            name: req.body.name || req.file.originalname,
            url: `/uploads/${req.file.filename}`
        };

        moduleItem.files.push(fileData);
        await moduleItem.save();

        res.status(200).json({
            message: 'File uploaded and attached to module',
            file: fileData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST add external link to subject
router.post('/link/subject/:id', async (req, res) => {
    try {
        const { name, url } = req.body;
        if (!name || !url) return res.status(400).json({ message: 'Name and URL are required' });

        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const fileData = { name, url };
        subject.files.push(fileData);
        await subject.save();

        res.status(200).json({ message: 'Link attached to subject', file: fileData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST add external link to module
router.post('/link/module/:id', async (req, res) => {
    try {
        const { name, url } = req.body;
        if (!name || !url) return res.status(400).json({ message: 'Name and URL are required' });

        const moduleItem = await Module.findById(req.params.id);
        if (!moduleItem) return res.status(404).json({ message: 'Module not found' });

        const fileData = { name, url };
        moduleItem.files.push(fileData);
        await moduleItem.save();

        res.status(200).json({ message: 'Link attached to module', file: fileData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE file/link from subject
router.delete('/subject/:id/:fileId', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const file = subject.files.id(req.params.fileId);
        if (!file) return res.status(404).json({ message: 'File not found' });

        // Delete from filesystem only if it's an uploaded file
        if (file.url && file.url.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', file.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        subject.files.pull(req.params.fileId);
        await subject.save();

        res.status(200).json({ message: 'File deleted from subject' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE file/link from module
router.delete('/module/:id/:fileId', async (req, res) => {
    try {
        const moduleItem = await Module.findById(req.params.id);
        if (!moduleItem) return res.status(404).json({ message: 'Module not found' });

        const file = moduleItem.files.id(req.params.fileId);
        if (!file) return res.status(404).json({ message: 'File not found' });

        // Delete from filesystem only if it's an uploaded file
        if (file.url && file.url.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', file.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        moduleItem.files.pull(req.params.fileId);
        await moduleItem.save();

        res.status(200).json({ message: 'File deleted from module' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
