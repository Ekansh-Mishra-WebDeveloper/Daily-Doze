const express = require('express');
const router = express.Router();
const SiteSetting = require('../models/SiteSetting');

// GET site settings
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSetting.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE site settings
router.put('/', async (req, res) => {
  try {
    const settings = await SiteSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;