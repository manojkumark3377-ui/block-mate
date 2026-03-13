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
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".netlify.app") || origin.endsWith(".vercel.app")) {
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
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        const localUri = process.env.MONGODB_URI;
        const atlasUri = process.env.MONGODB_ATLAS_URI;

        if (!localUri && !atlasUri) {
            throw new Error("Neither MONGODB_URI nor MONGODB_ATLAS_URI is defined in environment variables");
        }

        // Production should use Atlas, Dev can prefer Local
        const isProd = process.env.NODE_ENV === 'production';
        const uri = (isProd && atlasUri) ? atlasUri : (localUri || atlasUri);
        const source = (uri === atlasUri) ? "Atlas" : "Local";

        console.log(`Connecting to MongoDB... (${source})`);
        const conn = await mongoose.connect(uri.trim());
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host} (${source})`);
    } catch (error) {
        console.error(`FATAL: Database connection failed! (${error.message})`);
        if (process.env.NODE_ENV !== 'production') {
            console.error("TIP: Ensure your MongoDB service is running (local) or your Atlas IP whitelist allows this connection.");
        }
        throw error;
    }
};

// Start Server only if NOT in a serverless environment
if (!process.env.VERCEL && !process.env.SERVERLESS) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    }).catch(err => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}

// Middleware to ensure DB is connected for serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ message: "Database connection error", error: error.message });
    }
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
if (process.env.VERCEL || process.env.SERVERLESS) {
    module.exports = app;
}

// Unified Hosting: Serve Frontend Static Files
// This allows the backend to serve the frontend on the same port/server
const frontendDistPath = path.join(__dirname, '../dist');
if (fs.existsSync(frontendDistPath)) {
    console.log(`Serving frontend from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    // Handle React Router client-side routing: serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.url.startsWith('/api/v1')) {
            return next();
        }
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
} else {
    console.warn("WARNING: Frontend 'dist' folder not found. Unified hosting will not serve the UI.");
}
