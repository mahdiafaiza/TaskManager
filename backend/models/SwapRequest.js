// models/SwapRequest.js
const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // student initiating the swap
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // student who owns the target book
    },
    requestedBookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true, // the book being requested
    },
    offeredBookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null, // optional: if requester offers one of their own books in return
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '', // optional note to the book owner
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
