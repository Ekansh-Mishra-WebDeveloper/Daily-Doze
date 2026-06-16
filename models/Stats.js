const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  // Homepage stats
  membersCount: { type: Number, default: 0 },
  trainersCount: { type: Number, default: 0 },
  transformationsCount: { type: Number, default: 0 },
  // Members page stats
  totalMembers: { type: Number, default: 0 },
  activeMembers: { type: Number, default: 0 },
  membersTransformations: { type: Number, default: 0 }  // the "1,250+" on members page
});

module.exports = mongoose.model('Stats', statsSchema);