const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'admin'], default: 'volunteer' },
  // other personal details
});

module.exports = mongoose.model('User', UserSchema);