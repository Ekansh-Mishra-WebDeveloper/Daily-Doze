const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const StaffTrainer = require('../models/StaffTrainer');
const Payment = require('../models/Payment');          // NEW
const Membership = require('../models/Membership');    // NEW (for default prices)

const router = express.Router();

// Middleware to verify trainer token
const authTrainer = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'trainer') return res.status(403).json({ error: 'Forbidden' });
    req.trainerId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all members
router.get('/members', authTrainer, async (req, res) => {
  try {
    const members = await Member.find().select('-__v');
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== NEW: Trainer‑only member creation ==========
router.post('/members', authTrainer, async (req, res) => {
  try {
    const { name, age, gender, phone, photoUrl } = req.body;
    if (!name || !age) return res.status(400).json({ error: 'Name and age are required' });

    const newMember = new Member({
      name,
      age,
      gender: gender || 'male',
      phone: phone || '',
      photoUrl: photoUrl || 'defaultpfp.png',
      experience: 'beginner',
      goal: 'musclegain',
      status: 'active',
      feeStatus: 'unpaid',
      since: new Date()   // explicitly set registration date
    });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== NEW: Record fee payment (with amount, trainerId, and payment record) ==========
router.post('/payments', authTrainer, async (req, res) => {
  const { memberId, months, amount } = req.body;
  if (!memberId || !months || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (![1, 3].includes(months)) {
    return res.status(400).json({ error: 'Invalid duration' });
  }

  try {
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const paymentDate = new Date();
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    // Update member
    member.feeStatus = 'paid';
    member.lastPaymentDate = paymentDate;
    member.membershipExpiry = expiryDate;
    await member.save();

    // Create payment record
    const payment = new Payment({
      memberId,
      trainerId: req.trainerId,
      amount,
      months,
      paymentDate
    });
    await payment.save();

    res.json({ success: true, message: `Payment recorded for ${member.name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== End of new endpoints – keep all existing routes below ==========

// Get attendance dates for a specific member
router.get('/attendance/member/:memberId', authTrainer, async (req, res) => {
  const { memberId } = req.params;
  try {
    const records = await Attendance.find({
      type: 'member',
      memberId,
      status: 'present'
    }).select('date');
    const dates = records.map(r => r.date);
    res.json({ dates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance dates for ALL members at once (optimized)
router.get('/attendance/all-members', authTrainer, async (req, res) => {
  try {
    const records = await Attendance.find({
      type: 'member',
      status: 'present'
    }).select('memberId date');
    const grouped = {};
    records.forEach(record => {
      const memberId = record.memberId.toString();
      if (!grouped[memberId]) grouped[memberId] = [];
      grouped[memberId].push(record.date);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record member attendance (checkin / checkout) - shift determined server-side
router.post('/attendance/member', authTrainer, async (req, res) => {
  const { memberId, action } = req.body;
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const hour = now.getHours();
  const shift = hour < 12 ? 'morning' : 'evening';

  try {
    let record = await Attendance.findOne({
      type: 'member',
      memberId,
      date: dateStr,
      shift
    });

    if (!record) {
      record = new Attendance({
        type: 'member',
        memberId,
        date: dateStr,
        shift,
        status: 'present'
      });
    }

    if (action === 'checkin') {
      if (record.checkinTime) return res.status(400).json({ error: 'Already checked in for this shift' });
      record.checkinTime = timeStr;
    } else if (action === 'checkout') {
      if (!record.checkinTime) return res.status(400).json({ error: 'Must check in first' });
      if (record.checkoutTime) return res.status(400).json({ error: 'Already checked out' });
      record.checkoutTime = timeStr;
    }
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record trainer (staff) attendance
router.post('/attendance/trainer', authTrainer, async (req, res) => {
  const { shift, action } = req.body;
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  try {
    let record = await Attendance.findOne({
      type: 'trainer',
      trainerId: req.trainerId,
      date: dateStr,
      shift
    });

    if (!record) {
      record = new Attendance({
        type: 'trainer',
        trainerId: req.trainerId,
        date: dateStr,
        shift,
        status: 'present'
      });
    }

    if (action === 'checkin') {
      if (record.checkinTime) return res.status(400).json({ error: 'Already checked in' });
      record.checkinTime = timeStr;
    } else if (action === 'checkout') {
      if (!record.checkinTime) return res.status(400).json({ error: 'Must check in first' });
      if (record.checkoutTime) return res.status(400).json({ error: 'Already checked out' });
      record.checkoutTime = timeStr;
    }
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance stats for graph (members per day – last 30 days)
router.get('/attendance/stats/members', authTrainer, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startStr = startDate.toISOString().split('T')[0];
    const records = await Attendance.aggregate([
      { $match: { type: 'member', date: { $gte: startStr }, status: 'present' } },
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const result = records.map(r => ({ date: r._id, count: r.count }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trainer's own attendance (for calendar heatmap)
router.get('/attendance/trainer/my', authTrainer, async (req, res) => {
  try {
    const records = await Attendance.find({ 
      type: 'trainer', 
      trainerId: req.trainerId 
    }).select('date shift checkinTime checkoutTime');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fee statistics
router.get('/fees/stats', authTrainer, async (req, res) => {
  try {
    const total = await Member.countDocuments();
    const paid = await Member.countDocuments({ feeStatus: 'paid' });
    const unpaid = total - paid;
    res.json({ total, paid, unpaid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member fee status (simple)
router.put('/members/:id/fee', authTrainer, async (req, res) => {
  const { feeStatus } = req.body;
  if (!['paid', 'unpaid'].includes(feeStatus)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, { feeStatus }, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record fee payment (submit fees) - older version kept for compatibility (can be removed later)
router.post('/members/:id/pay', authTrainer, async (req, res) => {
  const { months } = req.body;
  const memberId = req.params.id;
  
  if (!months || (months !== 1 && months !== 3)) {
    return res.status(400).json({ error: 'Invalid duration. Choose 1 or 3 months.' });
  }
  
  try {
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    
    const paymentDate = new Date();
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);
    
    member.feeStatus = 'paid';
    member.lastPaymentDate = paymentDate;
    member.membershipExpiry = expiryDate;
    await member.save();
    
    res.json({ 
      success: true, 
      message: `Payment recorded for ${member.name}. Membership valid until ${expiryDate.toLocaleDateString()}`,
      expiry: expiryDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;