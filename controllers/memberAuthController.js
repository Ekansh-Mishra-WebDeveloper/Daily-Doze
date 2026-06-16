// controllers/memberAuthController.js
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new member
// @route   POST /api/auth/member-register
exports.registerMember = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, age, phone, photoUrl, goal } = req.body;

    // Check if email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new member
    const member = await Member.create({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      password,
      gender: gender || 'male',
      age: age || 0,
      phone: phone || '',
      photoUrl: photoUrl || 'defaultpfp.png',
      goal: goal || 'musclegain',
      status: 'active',
      feeStatus: 'unpaid',
      membershipExpiry: null
    });

    const memberObj = member.toObject();
    delete memberObj.password;

    res.status(201).json({
      token: generateToken(member._id),
      member: memberObj
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Login member (by email or phone)
// @route   POST /api/auth/member-login
exports.loginMember = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    let query = {};
    if (email) query.email = email;
    else if (phone) query.phone = phone;
    else return res.status(400).json({ error: 'Email or phone number required' });

    const member = await Member.findOne(query).select('+password');
    if (!member) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const memberObj = member.toObject();
    delete memberObj.password;

    res.json({
      token: generateToken(member._id),
      member: memberObj
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};