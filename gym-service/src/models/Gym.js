const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  facilities: { type: [String], required: true },
  details: { type: String, required: true },
  openingHours: { type: String, required: true },
  pricing: { type: String, required: true }
});

module.exports = mongoose.model('Gym', GymSchema);
