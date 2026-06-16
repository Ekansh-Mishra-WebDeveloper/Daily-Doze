const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Existing models
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const StaffTrainer = require('../models/StaffTrainer');
const Attendance = require('../models/Attendance');

// Additional models needed for admin.html
const SiteSetting = require('../models/SiteSetting');
const Stats = require('../models/Stats');
const Transformation = require('../models/Transformation');
const DietPlan = require('../models/DietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const Membership = require('../models/Membership');
const Product = require('../models/Product');
const Gallery = require('../models/Gallery');
const Reel = require('../models/Reel');
const Review = require('../models/Review');
const ContactInfo = require('../models/ContactInfo');

// Public Trainer model (for website display)
const Trainer = require('../models/Trainer');

// All routes are protected with admin authentication
router.use(protect);

// ========== PAYMENTS ==========
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== MEMBERS ==========
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/members', async (req, res) => {
  try {
    const { name, age, gender, phone, photoUrl, experience, goal, status, feeStatus } = req.body;
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required' });
    }
    const newMember = new Member({
      name,
      age,
      gender,
      phone,
      photoUrl: photoUrl || 'defaultpfp.png',
      since: new Date(),
      experience: experience || 'beginner',
      goal: goal || 'musclegain',
      status: status || 'active',
      feeStatus: feeStatus || 'unpaid'
    });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE member
router.put('/members/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE member
router.delete('/members/:id', async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Member not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== PUBLIC TRAINERS (for website) ==========
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/trainers', async (req, res) => {
  try {
    const { name, position, photoUrl, bio, whatsappNumber, instagramUrl } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const newTrainer = new Trainer({
      name,
      position: position || 'Fitness Coach',
      photoUrl: photoUrl || 'default_trainer.png',
      bio: bio || '',
      whatsappNumber: whatsappNumber || '',
      instagramUrl: instagramUrl || ''
    });
    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/trainers/:id', async (req, res) => {
  try {
    const updated = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Trainer not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/trainers/:id', async (req, res) => {
  try {
    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Trainer not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== STAFF TRAINERS (internal management) ==========
router.get('/staff', async (req, res) => {
  try {
    const staff = await StaffTrainer.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/staff', async (req, res) => {
  try {
    const { name, position, photoUrl, hireDate, salary, whatsappNumber, email } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const newStaff = new StaffTrainer({
      name,
      position: position || 'Staff',
      photoUrl: photoUrl || 'default_staff.png',
      hireDate: hireDate || new Date(),
      salary: salary || 0,
      whatsappNumber: whatsappNumber || '',
      email: email || ''
    });
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/staff/:id', async (req, res) => {
  try {
    const updated = await StaffTrainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Staff not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/staff/:id', async (req, res) => {
  try {
    const deleted = await StaffTrainer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Staff not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ATTENDANCE ==========
router.get('/attendance/all-members', async (req, res) => {
  try {
    const records = await Attendance.find({ type: 'member' });
    const map = {};
    records.forEach(rec => {
      if (rec.memberId) {
        if (!map[rec.memberId]) map[rec.memberId] = [];
        map[rec.memberId].push(rec.date);
      }
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/attendance/trainer/all', async (req, res) => {
  try {
    const records = await Attendance.find({ type: 'trainer' });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/attendance/stats/members', async (req, res) => {
  try {
    const records = await Attendance.aggregate([
      { $match: { type: 'member', checkinTime: { $exists: true, $ne: null } } },
      { $group: { _id: { date: '$date', memberId: '$memberId' } } },
      { $group: { _id: '$_id.date', count: { $sum: 1 } } },
      { $project: { date: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/attendance/member', async (req, res) => {
  try {
    const { memberId, action } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const shift = new Date().getHours() >= 12 ? 'evening' : 'morning';
    let record = await Attendance.findOne({ type: 'member', memberId, date: today, shift });
    if (!record) {
      record = new Attendance({ type: 'member', memberId, date: today, shift });
    }
    if (action === 'checkin') {
      record.checkinTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      record.status = 'present';
    } else if (action === 'checkout') {
      record.checkoutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    await record.save();
    res.json({ record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SITE SETTINGS ==========
router.get('/sitesetting', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = new SiteSetting();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/sitesetting', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = new SiteSetting();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== STATS ==========
router.get('/stats', async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = new Stats({ membersCount: 1500, trainersCount: 20, transformationsCount: 500 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/stats', async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = new Stats();
    Object.assign(stats, req.body);
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== TRANSFORMATIONS ==========
router.get('/transformations', async (req, res) => {
  try {
    const data = await Transformation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/transformations', async (req, res) => {
  try {
    const newItem = new Transformation(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/transformations/:id', async (req, res) => {
  try {
    const updated = await Transformation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/transformations/:id', async (req, res) => {
  try {
    await Transformation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== DIET PLANS ==========
router.get('/dietplans', async (req, res) => {
  try {
    const data = await DietPlan.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/dietplans', async (req, res) => {
  try {
    const newItem = new DietPlan(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/dietplans/:id', async (req, res) => {
  try {
    const updated = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/dietplans/:id', async (req, res) => {
  try {
    await DietPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== WORKOUT PLANS ==========
router.get('/workoutplans', async (req, res) => {
  try {
    const data = await WorkoutPlan.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/workoutplans', async (req, res) => {
  try {
    const newItem = new WorkoutPlan(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/workoutplans/:id', async (req, res) => {
  try {
    const updated = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/workoutplans/:id', async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== MEMBERSHIPS ==========
router.get('/memberships', async (req, res) => {
  try {
    const data = await Membership.find().sort({ price: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/memberships', async (req, res) => {
  try {
    const newItem = new Membership(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/memberships/:id', async (req, res) => {
  try {
    const updated = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/memberships/:id', async (req, res) => {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== PRODUCTS ==========
router.get('/products', async (req, res) => {
  try {
    const data = await Product.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const newItem = new Product(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GALLERY ==========
router.get('/gallery', async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (!gallery) gallery = new Gallery({ images: [] });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/gallery', async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (!gallery) gallery = new Gallery();
    gallery.images = req.body.images;
    await gallery.save();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== REELS ==========
router.get('/reels', async (req, res) => {
  try {
    const data = await Reel.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reels', async (req, res) => {
  try {
    const newItem = new Reel(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/reels/:id', async (req, res) => {
  try {
    const updated = await Reel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/reels/:id', async (req, res) => {
  try {
    await Reel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== REVIEWS ==========
router.get('/reviews', async (req, res) => {
  try {
    const data = await Review.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const newItem = new Review(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== CONTACT INFO ==========
router.get('/contactinfo', async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) info = new ContactInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/contactinfo', async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) info = new ContactInfo();
    Object.assign(info, req.body);
    await info.save();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;