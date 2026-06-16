const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

router.get('/', async (req, res) => {
  try {
    const stats = await Stats.findOne();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const stats = await Stats.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;