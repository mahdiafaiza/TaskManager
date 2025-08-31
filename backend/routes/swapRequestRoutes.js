const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getOwnerSwapRequests,
  getRequesterSwapRequests,
  respondToSwapRequest,
} = require('../controllers/SwapRequestController');
const { protect } = require('../middleware/authMiddleware');

// Create a new swap request
router.post('/', protect, createSwapRequest);

// Get all swap requests for books owned by logged-in user
router.get('/owner', protect, getOwnerSwapRequests);

// Get all swap requests made by the logged-in user (requester)
router.get('/requester', protect, getRequesterSwapRequests);

// Accept or reject a swap request (owner only)
router.put('/:id/respond', protect, respondToSwapRequest);

module.exports = router;
