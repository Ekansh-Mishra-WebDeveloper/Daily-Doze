const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  type: { type: String, enum: ['member', 'trainer'], required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffTrainer' }, // FIXED: now references StaffTrainer
  date: { type: String, required: true }, // YYYY-MM-DD
  shift: { type: String, enum: ['morning', 'evening'], required: true },
  checkinTime: { type: String }, // HH:MM AM/PM
  checkoutTime: { type: String },
  status: { type: String, enum: ['present', 'absent'], default: 'absent' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to avoid duplicate checkin per shift per day
attendanceSchema.index({ type: 1, memberId: 1, trainerId: 1, date: 1, shift: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);