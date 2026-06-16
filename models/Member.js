const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  // === NEW FIELDS (for member auth & dashboard) ===
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, select: false },
  
  // === ORIGINAL FIELDS ===
  name: { type: String },  // ✅ NOT required – pre-save hook sets it from firstName+lastName
  age: { type: Number, required: true },
  gender: { type: String, default: 'male' },
  phone: { type: String },
  photoUrl: { type: String, default: 'defaultpfp.png' },
  since: { type: String, default: () => new Date().getFullYear().toString() },
  experience: { type: String, default: 'beginner' },
  goal: { type: String, default: 'musclegain' },
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  feeStatus: { type: String, default: 'unpaid' },
  position: { type: String, default: 'Member' },
  feedback: { type: String, default: '' },
  lastPaymentDate: { type: Date },
  membershipExpiry: { type: Date }
}, { timestamps: true });

// Pre-save hook to hash password if modified
memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
memberSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Auto-generate 'name' from firstName+lastName if not provided
memberSchema.pre('save', function(next) {
  if (this.firstName && this.lastName && (!this.name || this.isModified('firstName') || this.isModified('lastName'))) {
    this.name = `${this.firstName} ${this.lastName}`.trim();
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);