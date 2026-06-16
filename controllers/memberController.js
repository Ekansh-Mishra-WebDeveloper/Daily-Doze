// controllers/memberController.js
const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const MemberWeight = require('../models/MemberWeight');
const MemberPR = require('../models/MemberPR');

const getFormattedTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// @desc    Get member profile
// @route   GET /api/member/profile
exports.getProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.memberId).select('-password');
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const now = new Date();
    const isActive = member.membershipExpiry ? new Date(member.membershipExpiry) > now : false;

    res.json({
      ...member.toObject(),
      membershipActive: isActive,
      membershipValidUntil: member.membershipExpiry
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update member profile
// @route   PUT /api/member/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'gender', 'age', 'phone', 'email', 'photoUrl', 'goal'];
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // If firstName or lastName updated, recompute 'name'
    if (updates.firstName || updates.lastName) {
      const member = await Member.findById(req.memberId);
      const newFirstName = updates.firstName ?? member.firstName;
      const newLastName = updates.lastName ?? member.lastName;
      updates.name = `${newFirstName} ${newLastName}`.trim();
    }

    // If email is being changed, check uniqueness
    if (updates.email) {
      const existing = await Member.findOne({ email: updates.email, _id: { $ne: req.memberId } });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    const member = await Member.findByIdAndUpdate(
      req.memberId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Change password
// @route   POST /api/member/change-password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const member = await Member.findById(req.memberId).select('+password');
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const isMatch = await member.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    member.password = newPassword;
    await member.save(); // pre-save hook will hash it

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get member attendance logs
// @route   GET /api/member/attendance/logs
exports.getAttendanceLogs = async (req, res) => {
  try {
    const logs = await Attendance.find({
      type: 'member',
      memberId: req.memberId
    }).sort({ date: -1 });
    const formatted = logs.map(log => ({
      date: log.date,
      checkinTime: log.checkinTime,
      checkoutTime: log.checkoutTime,
      shift: log.shift
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Record member check-in or check-out
// @route   POST /api/member/attendance
exports.recordAttendance = async (req, res) => {
  try {
    const { action } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = getFormattedTime();
    const hour = new Date().getHours();
    const shift = hour < 12 ? 'morning' : 'evening';

    let record = await Attendance.findOne({
      type: 'member',
      memberId: req.memberId,
      date: today,
      shift: shift
    });

    if (action === 'checkin') {
      if (record && record.checkinTime) {
        return res.status(400).json({ error: 'Already checked in for this shift' });
      }
      if (!record) {
        record = new Attendance({
          type: 'member',
          memberId: req.memberId,
          date: today,
          shift: shift,
          checkinTime: currentTime,
          status: 'present'
        });
      } else {
        record.checkinTime = currentTime;
        record.status = 'present';
      }
      await record.save();
      res.json({ record, message: 'Checked in successfully' });
    } 
    else if (action === 'checkout') {
      if (!record || !record.checkinTime) {
        return res.status(400).json({ error: 'Must check in before checkout' });
      }
      if (record.checkoutTime) {
        return res.status(400).json({ error: 'Already checked out for this shift' });
      }
      record.checkoutTime = currentTime;
      await record.save();
      res.json({ record, message: 'Checked out successfully' });
    } 
    else {
      res.status(400).json({ error: 'Invalid action. Use "checkin" or "checkout"' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get member weight history
// @route   GET /api/member/weight-history
exports.getWeightHistory = async (req, res) => {
  try {
    const weights = await MemberWeight.find({ memberId: req.memberId }).sort({ date: -1 });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add new weight entry
// @route   POST /api/member/weight
exports.addWeight = async (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight || isNaN(weight)) {
      return res.status(400).json({ error: 'Valid weight is required' });
    }
    const newWeight = new MemberWeight({
      memberId: req.memberId,
      weight: weight,
      date: new Date()
    });
    await newWeight.save();
    res.status(201).json(newWeight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get member exercise PRs
// @route   GET /api/member/exercise-prs
exports.getExercisePRs = async (req, res) => {
  try {
    let prs = await MemberPR.findOne({ memberId: req.memberId });
    if (!prs) {
      prs = new MemberPR({ memberId: req.memberId });
      await prs.save();
    }
    res.json({
      chest: prs.chest,
      back: prs.back,
      shoulders: prs.shoulders,
      biceps: prs.biceps,
      triceps: prs.triceps,
      legs: prs.legs,
      deadlift: prs.deadlift
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update member exercise PRs
// @route   PUT /api/member/exercise-prs
exports.updateExercisePRs = async (req, res) => {
  try {
    const allowed = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'deadlift'];
    const updates = {};
    for (let key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const prs = await MemberPR.findOneAndUpdate(
      { memberId: req.memberId },
      { $set: updates, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(prs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};