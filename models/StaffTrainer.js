const mongoose = require('mongoose');

const staffTrainerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  role: { type: String, default: 'trainer' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  age: { type: Number, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  photoUrl: { type: String, default: 'trainer-ultrafit-logo.png' },
  phone: { type: String, default: '' },
  hireDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

staffTrainerSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

module.exports = mongoose.model('StaffTrainer', staffTrainerSchema);