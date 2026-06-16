// models/MemberWeight.js
const mongoose = require('mongoose');

const memberWeightSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: Date, default: Date.now, required: true },
  weight: { type: Number, required: true } // weight in kg
});

// Index to allow fast queries by member and date
memberWeightSchema.index({ memberId: 1, date: -1 });

module.exports = mongoose.model('MemberWeight', memberWeightSchema);