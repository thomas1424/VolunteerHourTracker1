const mongoose = require('mongoose');

const VolunteerHoursSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  hours: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VolunteerHours', VolunteerHoursSchema);