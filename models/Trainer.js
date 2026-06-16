// models/Trainer.js (public-facing trainers for website)
const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  photoUrl: { type: String, required: true },
  bio: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  instagramUrl: { type: String, required: true }
});

module.exports = mongoose.model('Trainer', trainerSchema);