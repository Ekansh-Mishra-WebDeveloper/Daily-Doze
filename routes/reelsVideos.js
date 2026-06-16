const express = require('express');
const router = express.Router();
const { ReelVideo } = require('../models');

router.get('/', async (req, res) => {
  try {
    const reels = await ReelVideo.find().sort({ order: 1, createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const reel = await ReelVideo.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const reel = new ReelVideo(req.body);
    await reel.save();
    res.status(201).json(reel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const reel = await ReelVideo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const reel = await ReelVideo.findByIdAndDelete(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json({ message: 'Reel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;