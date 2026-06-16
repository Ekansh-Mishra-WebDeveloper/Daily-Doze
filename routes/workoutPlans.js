const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

router.get('/', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newPlan = new WorkoutPlan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;