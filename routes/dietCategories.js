const express = require('express');
const router = express.Router();
const DietCategory = require('../models/DietCategory');

router.get('/', async (req, res) => {
  try {
    const categories = await DietCategory.find().sort('order');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cat = new DietCategory(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:key', async (req, res) => {
  try {
    const updated = await DietCategory.findOneAndUpdate(
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
    await DietCategory.findOneAndDelete({ key: req.params.key });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;