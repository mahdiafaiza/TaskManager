const Book = require('../models/Book');

// Get all available books (excluding current user's own)
const getBooks = async (req, res) => {
  try {
    const query = { available: true };
    if (req.user) {
      query.ownerId = { $ne: req.user._id }; // exclude own books
    }
    const books = await Book.find(query).populate('ownerId', 'name email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's own books
const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.user._id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new book listing
const addBook = async (req, res) => {
  const { title, author, description, condition } = req.body;
  try {
    if (!title || !author || !condition) {
      return res.status(400).json({ message: 'Title, author, and condition are required' });
    }

    const book = await Book.create({
      ownerId: req.user._id,
      title,
      author,
      description: description || '',
      condition,
      available: true,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update book details (only owner can update)
const updateBook = async (req, res) => {
  const { title, author, description, condition, available } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.condition = condition || book.condition;
    book.available = available ?? book.available;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete book listing (only owner can delete)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await Book.deleteOne({ _id: book._id });
    res.json({ message: 'Book removed from listings' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Temporary swap request (MVP)
const requestSwap = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.available) return res.status(400).json({ message: 'Book is not available for swap' });
    if (book.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot request your own book' });
    }

    // For MVP: mark as unavailable
    book.available = false;
    await book.save();

    res.json({ message: 'Swap request initiated', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getMyBooks,
  addBook,
  updateBook,
  deleteBook,
  requestSwap,
};
