const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testAtlas = async (uri, label) => {
    console.log(`\n--- Testing Atlas Connection (${label}) ---`);
    console.log(`URI: ${uri.replace(/:([^@]+)@/, ':****@')}`); 
    
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`SUCCESS: Connected to MongoDB Atlas (${label})`);
        await mongoose.disconnect();
        return true;
    } catch (error) {
        console.log(`FAILURE (${label}): ${error.message}`);
        return false;
    }
};

const run = async () => {
    const baseUri = process.env.MONGODB_ATLAS_URI;
    const dbName = 'blog-app';
    
    // Add DB name before query params or at end
    const uriWithDb = baseUri.includes('?') 
        ? baseUri.replace('?', `${dbName}?`) 
        : baseUri.endsWith('/') ? `${baseUri}${dbName}` : `${baseUri}/${dbName}`;

    console.log('Starting Diagnostic...');
    
    const res = await testAtlas(uriWithDb, 'With DB Name');
    if (res) {
        console.log('\nAdding the database name worked!');
    } else {
        console.log('\nAdding the database name also failed with "Authentication Failed".');
        console.log('This confirms that the credentials (username/password) themselves are likely incorrect.');
    }
    
    process.exit(0);
};

run();
