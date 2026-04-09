const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function listUsers() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().select('name email role createdAt');
    console.log("\n=== ALL REGISTERED USERS ===");
    users.forEach(u => {
        console.log(`  ${u.role.padEnd(12)} | ${u.email.padEnd(30)} | ${u.name}`);
    });
    console.log(`\nTotal: ${users.length} users`);
    process.exit(0);
}
listUsers();
