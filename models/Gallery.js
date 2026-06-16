const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  images: [String]   // array of image URLs
});

module.exports = mongoose.model('Gallery', gallerySchema);