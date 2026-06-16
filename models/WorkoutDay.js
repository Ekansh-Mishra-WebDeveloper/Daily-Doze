const mongoose = require('mongoose');

const workoutDaySchema = new mongoose.Schema({
  categoryKey: { type: String, required: true },   // 'beginner', 'intermediate', 'expert'
  dayTitle: { type: String, required: true },      // 'Day 1 – Chest & Triceps'
  order: { type: Number, default: 0 },
  exercises: [{ name: String, reps: String }],     // e.g., [{ name: "Flat DB Press", reps: "3x12" }]
  images: [{ url: String, label: String }]         // exactly 4 images with labels
});

module.exports = mongoose.model('WorkoutDay', workoutDaySchema);