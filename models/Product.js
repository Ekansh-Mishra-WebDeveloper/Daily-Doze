const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  images: [String],
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  tags: [String],
  category: { type: String, enum: ['supplements', 'accessories'], default: 'supplements' },
  type: { type: String, default: '' },
  goal: { type: String, enum: ['musclegain', 'fatloss', 'general'], default: 'general' },
  isBestseller: { type: Boolean, default: false },
  isTrainerChoice: { type: Boolean, default: false },
  features: [String],
  benefits: [String]
});

module.exports = mongoose.model('Product', productSchema);