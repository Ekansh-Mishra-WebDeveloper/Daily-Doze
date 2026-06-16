const express = require('express');
const router = express.Router();
const LegalContent = require('../models/LegalContent');

// GET legal content by pageKey
router.get('/:pageKey', async (req, res) => {
  try {
    const content = await LegalContent.findOne({ pageKey: req.params.pageKey });
    if (!content) return res.status(404).json({ error: 'Page not found' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (admin only – to update content)
router.put('/:pageKey', async (req, res) => {
  try {
    const updated = await LegalContent.findOneAndUpdate(
      { pageKey: req.params.pageKey },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;