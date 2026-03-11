const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://vtublockmate.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173"
].filter(Boolean).map(origin => origin.replace(/\/$/, "")); // Remove trailing slashes

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".netlify.app")) {
            callback(null, true);
        } else {
            console.log(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// MongoDB Connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`FATAL: Database connection failed! (${error.message})`);
        console.error("TIP: If you are in production, make sure MONGODB_URI is set to your Atlas cluster URL, NOT localhost!");
        process.exit(1);
    }
};

// Start Server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const subjectRoutes = require('./routes/subject');
const moduleRoutes = require('./routes/module');
const uploadRoutes = require('./routes/upload');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Static folder for uploads - Use /tmp in serverless environments
const isServerless = process.env.VERCEL || process.env.SERVERLESS;
const uploadDir = isServerless ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Basic Routes
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'online',
        message: 'BlockMate API is working!',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.get('/api', (req, res) => {
    res.send('API is running...');
});

// Final 404 handler for unmatched routes
app.use((req, res, next) => {
    const errorMsg = `Route ${req.originalUrl} not found on server`;
    console.log(`404 NOT FOUND: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: errorMsg });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Help the user with CORS errors specifically
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            message: "CORS Error: This origin is not allowed. Check your FRONTEND_URL environment variable in Render.",
            tip: "I have automated .netlify.app subdomains, but if you use a custom domain, you MUST add it to allowedOrigins in server.js"
        });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Prevent unhandled promise rejections from crashing the server
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export the app for Vercel
module.exports = app;
