const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  facebookUrl: { type: String, required: true },
  instagramUrl: { type: String, required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);