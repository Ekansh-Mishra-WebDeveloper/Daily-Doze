const mongoose = require('mongoose');

const dietCategorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },   // 'veg', 'egg', 'nonveg'
  displayName: { type: String, required: true },         // 'Vegetarian Diet'
  pdfUrl: { type: String, default: '' },                 // URL of uploaded PDF
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('DietCategory', dietCategorySchema);