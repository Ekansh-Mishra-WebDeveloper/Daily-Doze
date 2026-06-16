const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  thumbnail: { type: String }   // optional thumbnail
});

module.exports = mongoose.model('Reel', reelSchema);