const express = require('express');
const router = express.Router();
const { GalleryImage } = require('../models');

router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const image = new GalleryImage(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;