// routes/swapRequestRoutes.js
const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getSwapRequests,
  respondToSwapRequest,
  completeSwap,
} = require('./controllers/SwapRequestController');

// Middleware to protect routes (assumes you have auth middleware)
const { protect } = require('../middleware/authMiddleware');

// Create a new swap request
router.post('/', protect, createSwapRequest);

// Get all swap requests for logged-in user
router.get('/', protect, getSwapRequests);

// Respond to a swap request (accept or reject)
router.patch('/:id/respond', protect, respondToSwapRequest);

// Mark swap as completed
router.patch('/:id/complete', protect, completeSwap);

module.exports = router;
