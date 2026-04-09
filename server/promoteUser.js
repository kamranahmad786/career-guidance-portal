const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'SuperAdmin';
        await user.save();

        console.log(`SUCCESS: User ${user.name} (${email}) promoted to SuperAdmin.`);
        process.exit(0);
    } catch (err) {
        console.error("Promotion Error:", err);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log("Usage: node promoteUser.js <email>");
    process.exit(1);
}

promoteUser(email);
