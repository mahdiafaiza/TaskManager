const SwapRequest = require('../models/SwapRequest');
const Book = require('../models/Book');

// Create a new swap request
const createSwapRequest = async (req, res) => {
  try {
    const { requestedBookId, offeredBookId, message } = req.body;

    const requestedBook = await Book.findById(requestedBookId);
    if (!requestedBook) return res.status(404).json({ message: 'Requested book not found' });
    if (!requestedBook.available) return res.status(400).json({ message: 'Book is not available' });
    if (requestedBook.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own book' });
    }

    const swapRequest = await SwapRequest.create({
      requesterId: req.user._id,
      ownerId: requestedBook.ownerId,
      requestedBookId,
      offeredBookId: offeredBookId || null,
      message: message || '',
    });

    res.status(201).json(swapRequest);
  } catch (err) {
    console.error('Error creating swap request:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all swap requests for books owned by logged-in user
const getOwnerSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ ownerId: req.user._id })
      .populate('requesterId', 'name email')
      .populate('requestedBookId', 'title author')
      .populate('offeredBookId', 'title author')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Error fetching owner swap requests:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all swap requests made by the logged-in user (requester)
const getRequesterSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ requesterId: req.user._id })
      .populate('ownerId', 'name email')
      .populate('requestedBookId', 'title author')
      .populate('offeredBookId', 'title author')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Error fetching requester swap requests:', err);
    res.status(500).json({ message: err.message });
  }
};

// Accept or reject a swap request (owner only)
const respondToSwapRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const swapRequest = await SwapRequest.findById(req.params.id);
    if (!swapRequest) return res.status(404).json({ message: 'Swap request not found' });

    if (swapRequest.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    swapRequest.status = status;

    if (status === 'accepted') {
      const book = await Book.findById(swapRequest.requestedBookId);
      if (book) {
        book.available = false;
        await book.save();
      }
    }

    await swapRequest.save();

    // Include requester email when accepted
    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requesterId', 'name email')
      .populate('ownerId', 'name email')
      .populate('requestedBookId', 'title author')
      .populate('offeredBookId', 'title author');

    res.json(populatedRequest);
  } catch (err) {
    console.error('Error responding to swap request:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSwapRequest,
  getOwnerSwapRequests,
  getRequesterSwapRequests,
  respondToSwapRequest,
};
