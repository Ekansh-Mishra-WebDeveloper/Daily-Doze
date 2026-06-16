// models/MemberPR.js
const mongoose = require('mongoose');

const memberPRSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, unique: true },
  chest: { type: Number, default: 0 },
  back: { type: Number, default: 0 },
  shoulders: { type: Number, default: 0 },
  biceps: { type: Number, default: 0 },
  triceps: { type: Number, default: 0 },
  legs: { type: Number, default: 0 },
  deadlift: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MemberPR', memberPRSchema);