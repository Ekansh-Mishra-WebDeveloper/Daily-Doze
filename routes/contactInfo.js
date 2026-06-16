const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo');

router.get('/', async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) contact = {};
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (contact) {
      Object.assign(contact, req.body);
      await contact.save();
    } else {
      contact = new ContactInfo(req.body);
      await contact.save();
    }
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;