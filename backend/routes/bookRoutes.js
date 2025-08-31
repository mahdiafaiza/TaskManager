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
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all available books (for gallery, excluding user's own)
router.get('/all', authMiddleware, getBooks);

// Get logged-in user's own books
router.get('/mine', authMiddleware, getMyBooks);

// Add a new book
router.post('/', authMiddleware, addBook);

// Update book (only owner)
router.put('/:id', authMiddleware, updateBook);

// Delete book (only owner)
router.delete('/:id', authMiddleware, deleteBook);

// Request swap for a book
router.post('/:id/request-swap', authMiddleware, requestSwap);

module.exports = router;
