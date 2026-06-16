const mongoose = require('mongoose');

const dietMealSchema = new mongoose.Schema({
  categoryKey: { type: String, required: true },   // 'veg', 'egg', 'nonveg'
  type: { type: String, enum: ['gain', 'loss'], required: true },
  mealTime: { type: String, required: true, trim: true },   // ✅ removed enum, now any string allowed
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ingredients: { type: String, required: true },
  quantity: { type: String, default: '1 serving' },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  tags: [String],
  isRecommended: { type: Boolean, default: false }
});

module.exports = mongoose.model('DietMeal', dietMealSchema);