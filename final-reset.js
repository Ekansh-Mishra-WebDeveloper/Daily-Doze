require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI;

const reset = async () => {
  await mongoose.connect(MONGODB_URI);
  await Admin.deleteMany({});
  const admin = new Admin({
    email: 'admin@ultrafit.com',
    password: 'admin123'
  });
  await admin.save();
  console.log('✅ Admin created: admin@ultrafit.com / admin123');
  process.exit();
};
reset();