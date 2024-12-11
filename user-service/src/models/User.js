const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  weight: Number,
  height: Number,
  bodyFatPercentage: Number,
  updatedAt: Date
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  progress: progressSchema,
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
