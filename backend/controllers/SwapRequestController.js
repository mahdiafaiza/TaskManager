// controllers/SwapRequestController.js
const SwapRequest = require('../models/SwapRequest');
const Book = require('../models/Book');

// Create a new swap request
const createSwapRequest = async (req, res) => {
  const { requestedBookId, offeredBookId, message } = req.body;

  try {
    const requestedBook = await Book.findById(requestedBookId);
    if (!requestedBook) return res.status(404).json({ message: 'Requested book not found' });
    if (!requestedBook.available) return res.status(400).json({ message: 'Book is not available' });
    if (requestedBook.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot request your own book' });
    }

    const swapRequest = await SwapRequest.create({
      requesterId: req.user.id,
      ownerId: requestedBook.ownerId,
      requestedBookId,
      offeredBookId: offeredBookId || null,
      message: message || '',
    });

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all swap requests for the logged-in user
const getSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [{ requesterId: req.user.id }, { ownerId: req.user.id }],
    })
      .populate('requesterId', 'name email')
      .populate('ownerId', 'name email')
      .populate('requestedBookId', 'title author')
      .populate('offeredBookId', 'title author');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to a swap request (accept or reject)
const respondToSwapRequest = async (req, res) => {
  const { status } = req.body; // expected "accepted" or "rejected"

  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    if (!swapRequest) return res.status(404).json({ message: 'Swap request not found' });

    if (swapRequest.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    swapRequest.status = status;

    // If accepted, mark book as unavailable
    if (status === 'accepted') {
      const requestedBook = await Book.findById(swapRequest.requestedBookId);
      if (requestedBook) {
        requestedBook.available = false;
        await requestedBook.save();
      }
    }

    await swapRequest.save();
    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark swap as completed
const completeSwap = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    if (!swapRequest) return res.status(404).json({ message: 'Swap request not found' });

    if (
      swapRequest.ownerId.toString() !== req.user.id &&
      swapRequest.requesterId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to complete this swap' });
    }

    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({ message: 'Swap must be accepted before completing' });
    }

    swapRequest.status = 'completed';
    await swapRequest.save();

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSwapRequest,
  getSwapRequests,
  respondToSwapRequest,
  completeSwap,
};
