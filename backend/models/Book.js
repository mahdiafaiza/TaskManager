const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'], required: true },
  available: { type: Boolean, default: true },
  // models/Book.js
requestedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
},


}, { timestamps: true });






module.exports = mongoose.model('Book', bookSchema);