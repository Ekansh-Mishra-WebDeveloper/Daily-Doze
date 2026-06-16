const express = require('express');
const router = express.Router();
const { Trainer } = require('../models');

// GET all trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ order: 1, createdAt: -1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single trainer
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create trainer
router.post('/', async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update trainer
router.put('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json(trainer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE trainer
router.delete('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;