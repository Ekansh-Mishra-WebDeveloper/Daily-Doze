const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  shortDescription: { type: String, required: true },
  targets: [String]   // e.g., ["Weight Loss", "Balanced"]
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);