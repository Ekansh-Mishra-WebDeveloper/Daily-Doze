const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },   // e.g., "month", "3 months"
  description: { type: String, required: true }
});

module.exports = mongoose.model('Membership', membershipSchema);