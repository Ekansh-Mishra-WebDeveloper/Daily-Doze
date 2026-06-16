const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware'); // reuse your protect middleware

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        photoUrl: admin.photoUrl || 'ultrafit_logo.png'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/admin/profile
router.get('/admin/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({
      id: admin._id,
      email: admin.email,
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      age: admin.age || '',
      gender: admin.gender || 'male',
      username: admin.username || admin.email.split('@')[0],
      photoUrl: admin.photoUrl || 'ultrafit_logo.png'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/admin/profile
router.put('/admin/profile', protect, async (req, res) => {
  try {
    const updateData = {};
    const allowed = ['firstName', 'lastName', 'age', 'gender', 'photoUrl'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }
    const admin = await Admin.findByIdAndUpdate(req.admin.id, updateData, { new: true }).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({
      id: admin._id,
      email: admin.email,
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      age: admin.age || '',
      gender: admin.gender || 'male',
      username: admin.username || admin.email.split('@')[0],
      photoUrl: admin.photoUrl || 'ultrafit_logo.png'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/check-username (optional, for profile)
router.get('/check-username', protect, async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const existing = await Admin.findOne({ username, _id: { $ne: req.admin.id } });
  res.json({ available: !existing });
});

// PUT /api/auth/update-username-password (optional, for profile)
router.put('/update-username-password', protect, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });
    if (newUsername && newUsername !== (admin.username || admin.email.split('@')[0])) {
      const existing = await Admin.findOne({ username: newUsername, _id: { $ne: req.admin.id } });
      if (existing) return res.status(400).json({ error: 'Username already taken' });
      admin.username = newUsername;
    }
    if (newPassword && newPassword.trim() !== '') admin.password = newPassword;
    await admin.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;