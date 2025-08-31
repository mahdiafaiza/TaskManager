const express = require('express');
const router = express.Router();
const {
  getBooks,
  getMyBooks,
  addBook,
  updateBook,
  deleteBook,
  requestSwap,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware'); // same style as auth routes

// Get all available books for gallery (excluding current user's own)
router.get('/all', protect, getBooks);

// Get logged-in user's own books
router.get('/mine', protect, getMyBooks);

// Add a new book
router.post('/', protect, addBook);

// Update a book (owner only)
router.put('/:id', protect, updateBook);

// Delete a book (owner only)
router.delete('/:id', protect, deleteBook);


module.exports = router;
