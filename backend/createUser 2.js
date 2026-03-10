const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    let user = await User.findOne({ email: 'manojkumark0333@gmail.com' });
    if (!user) {
        user = await User.create({
            name: 'Manoj',
            email: 'manojkumark0333@gmail.com',
            password: 'password123',
            dob: '2000-01-01',
            role: 'admin'
        });
        console.log('Created new admin user with email manojkumark0333@gmail.com and password: password123');
    } else {
        user.role = 'admin';
        await user.save();
        console.log('User manojkumark0333@gmail.com upgraded to admin.');
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
