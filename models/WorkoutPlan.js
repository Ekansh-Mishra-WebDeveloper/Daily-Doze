const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  shortDescription: { type: String, required: true },
  targets: [String]
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);