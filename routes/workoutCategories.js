const express = require('express');
const router = express.Router();
const WorkoutCategory = require('../models/WorkoutCategory');

router.get('/', async (req, res) => {
  try {
    const cats = await WorkoutCategory.find().sort('order');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cat = new WorkoutCategory(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:key', async (req, res) => {
  try {
    const updated = await WorkoutCategory.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:key', async (req, res) => {
  try {
    await WorkoutCategory.findOneAndDelete({ key: req.params.key });
    // Also delete all days under this category
    const WorkoutDay = require('../models/WorkoutDay');
    await WorkoutDay.deleteMany({ categoryKey: req.params.key });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;