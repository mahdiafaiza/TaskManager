const Book = require('../models/Book');

// Get all available books (excluding current user's own if needed)
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new book listing
const addBook = async (req, res) => {
  const { title, author, description, condition } = req.body;
  try {
    const book = await Book.create({
      ownerId: req.user.id,
      title,
      author,
      description,
      condition,
      available: true, // default when listed
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
    if (book.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this book' });

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
    if (book.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this book' });

    await book.remove();
    res.json({ message: 'Book removed from listings' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: Request swap with another student
const requestSwap = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.available) return res.status(400).json({ message: 'Book is not available for swap' });

    // For now: mark as unavailable, in real app you'd create a SwapRequest model
    book.available = false;
    await book.save();

    res.json({ message: 'Swap request initiated', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  requestSwap,
};
