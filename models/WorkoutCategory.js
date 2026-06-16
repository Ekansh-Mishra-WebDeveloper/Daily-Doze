const mongoose = require('mongoose');

const workoutCategorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },   // 'beginner', 'intermediate', 'expert'
  displayName: { type: String, required: true },         // 'Beginner'
  subheading: { type: String, default: '' },             // 'Foundation – 1 to 6 Months'
  pdfUrl: { type: String, default: '' },                 // URL of uploaded PDF
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('WorkoutCategory', workoutCategorySchema);