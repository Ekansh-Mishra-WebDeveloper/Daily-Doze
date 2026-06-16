const mongoose = require('mongoose');

const legalContentSchema = new mongoose.Schema({
  pageKey: { type: String, required: true, unique: true }, // 'privacy', 'refund', 'terms'
  heroHeading: { type: String, required: true },
  heroSubheading: { type: String, required: true },
  sections: [{
    title: { type: String, required: true },
    content: { type: String, required: true }  // HTML or plain text with line breaks
  }]
});

module.exports = mongoose.model('LegalContent', legalContentSchema);