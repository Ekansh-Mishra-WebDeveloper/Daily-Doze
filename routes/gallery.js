const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

router.get('/', async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (!gallery) gallery = { images: [] };
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (gallery) {
      gallery.images = req.body.images;
      await gallery.save();
    } else {
      gallery = new Gallery(req.body);
      await gallery.save();
    }
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;