// models/urlModel.js
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format.',
    },
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(6),
  },
  shortUrl: {
    type: String,
    required: false, // Changed to false since it's generated
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  visitCount: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String,
    required: false, // Changed to false since it's generated
  },
}, { timestamps: true });

// Add pre-save middleware to generate shortUrl
urlSchema.pre('save', function(next) {
  if (!this.shortUrl) {
    this.shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${this.shortCode}`;
  }
  next();
});

module.exports = mongoose.model('Url', urlSchema);