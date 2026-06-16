const express = require('express');
const jwt = require('jsonwebtoken');
const StaffTrainer = require('../models/StaffTrainer');

const router = express.Router();

router.post('/trainer-login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  try {
    const trainer = await StaffTrainer.findOne({ email });
    if (!trainer) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = trainer.password === password;
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: trainer._id, role: trainer.role || 'trainer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ 
      token, 
      trainer: { 
        id: trainer._id, 
        name: `${trainer.firstName} ${trainer.lastName}`.trim(),
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        age: trainer.age,
        gender: trainer.gender,
        username: trainer.username || trainer.email.split('@')[0],
        email: trainer.email, 
        photoUrl: trainer.photoUrl 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/trainer/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const trainer = await StaffTrainer.findById(decoded.id).select('-password');
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json({
      id: trainer._id,
      name: `${trainer.firstName} ${trainer.lastName}`.trim(),
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      age: trainer.age,
      gender: trainer.gender,
      username: trainer.username || trainer.email.split('@')[0],
      email: trainer.email,
      photoUrl: trainer.photoUrl
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.put('/trainer/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updateData = {};
    const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }
    const trainer = await StaffTrainer.findByIdAndUpdate(decoded.id, updateData, { new: true }).select('-password');
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json({
      id: trainer._id,
      name: `${trainer.firstName} ${trainer.lastName}`.trim(),
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      age: trainer.age,
      gender: trainer.gender,
      username: trainer.username || trainer.email.split('@')[0],
      email: trainer.email,
      photoUrl: trainer.photoUrl
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.get('/check-username', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });
    const existing = await StaffTrainer.findOne({ username, _id: { $ne: decoded.id } });
    res.json({ available: !existing });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.put('/update-username-password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newUsername, newPassword } = req.body;
    const trainer = await StaffTrainer.findById(decoded.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    if (trainer.password !== currentPassword) return res.status(401).json({ error: 'Current password is incorrect' });
    if (newUsername && newUsername !== (trainer.username || trainer.email.split('@')[0])) {
      const existing = await StaffTrainer.findOne({ username: newUsername, _id: { $ne: decoded.id } });
      if (existing) return res.status(400).json({ error: 'Username already taken' });
      trainer.username = newUsername;
    }
    if (newPassword && newPassword.trim() !== '') trainer.password = newPassword;
    await trainer.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;