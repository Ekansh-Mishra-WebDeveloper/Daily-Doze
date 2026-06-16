const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffTrainer', required: true },
  amount: { type: Number, required: true },
  months: { type: Number, enum: [1, 3], required: true },
  paymentDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
});

module.exports = mongoose.model('Payment', paymentSchema);