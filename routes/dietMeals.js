const express = require('express');
const router = express.Router();
const DietMeal = require('../models/DietMeal');

router.get('/', async (req, res) => {
  try {
    const meals = await DietMeal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const meal = new DietMeal(req.body);
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await DietMeal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await DietMeal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;