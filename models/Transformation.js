const mongoose = require('mongoose');

const transformationSchema = new mongoose.Schema({
  beforeImage: { type: String, required: true },
  afterImage: { type: String, required: true }
});

module.exports = mongoose.model('Transformation', transformationSchema);