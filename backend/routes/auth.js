const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Nodemailer transporter (created lazily so env vars are loaded first)
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
}

function hashOtp(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

// @desc    Register a user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request body:', req.body);
        const { name, email, password, dob } = req.body;

        // Validate required fields
        if (!name || !email || !password || !dob) {
            console.log('Missing fields:', { name: !!name, email: !!email, password: !!password, dob: !!dob });
            return res.status(400).json({
                message: 'Please provide name, email, password, and date of birth'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Signup attempt for existing email:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            dob
        });

        console.log('User created:', user?._id);

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: "Details Saved",
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim();
        if (!email) {
            return res.status(400).json({ message: 'Please provide an email' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP and hash it before storing
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Log OTP in development for easier testing
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] OTP for ${email}: ${otp}`);
        }

        user.resetPasswordOTP = hashOtp(otp);
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send OTP via email
        try {
            await createTransporter().sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: 'BløckMate - Password Reset OTP',
                text: `Your OTP is ${otp}. It expires in 10 minutes. Do not share it with anyone.`,
            });
            res.json({ message: 'OTP sent to registered email' });
        } catch (mailError) {
            console.error('Mail sending failed:', mailError);
            if (process.env.NODE_ENV !== 'production') {
                return res.json({
                    message: 'OTP generated (Check console as Mail failed in Dev)',
                    dev: true
                });
            }
            throw mailError;
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { otp, newPassword } = req.body;
        const email = req.body.email?.toLowerCase().trim();

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, otp and new password' });
        }

        // Compare hashed OTP
        const user = await User.findOne({
            email,
            resetPasswordOTP: hashOtp(otp),
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request:', { email, password: '***' });

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', !!user);

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: "Login successful",
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                dob: user.dob
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    console.log('PUT /profile hit. User ID:', req.user?._id);
    console.log('Request Body:', req.body);
    try {
        const user = await User.findById(req.user._id).select('+password');

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Only update password if provided
            if (req.body.password && req.body.password.trim() !== "") {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                message: "Profile updated successfully",
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Change user password
// @route   PUT /api/v1/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if old password matches
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password does not match' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = router;
