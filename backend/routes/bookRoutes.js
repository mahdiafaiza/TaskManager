const express = require('express');
const { addBook, getBooks } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// add new book
router.post('/', protect, addBook);

// get all books for logged-in user
router.get('/', protect, getBooks);

module.exports = router;
