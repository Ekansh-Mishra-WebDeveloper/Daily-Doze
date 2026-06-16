// scripts/resetStaff.js
require('dotenv').config();
const mongoose = require('mongoose');
const StaffTrainer = require('../models/StaffTrainer');

async function reset() {
  await mongoose.connect(process.env.MONGODB_URI);
  const staffList = [
    { email: 'ultrafit@1', firstName: 'Staff', lastName: 'One', age: 25, gender: 'male' },
    { email: 'ultrafit@2', firstName: 'Staff', lastName: 'Two', age: 26, gender: 'female' },
    // ... rest
  ];
  for (const staff of staffList) {
    await StaffTrainer.findOneAndUpdate(
      { email: staff.email },
      { firstName: staff.firstName, lastName: staff.lastName, age: staff.age, gender: staff.gender, name: `${staff.firstName} ${staff.lastName}` }
    );
    console.log(`Updated ${staff.email}`);
  }
  console.log('Done!');
  process.exit();
}
reset();