import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const BookGallery = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [formData, setFormData] = useState({}); // store per-book form data

  // Fetch all available books (excluding user's own)
  useEffect(() => {
    if (!user?.token) return;

    const fetchBooks = async () => {
      try {
        const res = await axiosInstance.get('/api/books/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, [user]);

  // Fetch current user's books
  useEffect(() => {
    if (!user?.token) return;

    const fetchMyBooks = async () => {
      try {
        const res = await axiosInstance.get('/api/books/mine', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUserBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyBooks();
  }, [user]);

  const handleInputChange = (bookId, field, value) => {
    setFormData({
      ...formData,
      [bookId]: { ...formData[bookId], [field]: value },
    });
  };

  const handleSwapRequest = async (book) => {
    if (!user?.token) return alert('You must be logged in.');

    const { offeredBookId, message } = formData[book._id] || {};

    try {
      const response = await axiosInstance.post(
        '/api/swaps',
        {
          requestedBookId: book._id,
          offeredBookId: offeredBookId || null,
          message: message || '',
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert('Swap request sent!');
      // Update the book as unavailable
      setBooks(books.map(b => (b._id === book._id ? { ...b, available: false } : b)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send swap request.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Book Gallery</h1>
      {books.length === 0 ? (
        <p className="text-gray-500">No books available for swap.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white p-4 shadow-md rounded">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">by {book.author}</p>
              <p className="mt-2">{book.description}</p>
              <p className="mt-1 text-sm text-gray-500">Condition: {book.condition}</p>
              <p className="mt-1 text-sm text-gray-500">Owner: {book.ownerId?.name || 'Unknown'}</p>

              {book.available ? (
                <div className="mt-4 space-y-2">
                  <select
                    value={formData[book._id]?.offeredBookId || ''}
                    onChange={(e) => handleInputChange(book._id, 'offeredBookId', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Offer one of your books (optional)</option>
                    {userBooks.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title}
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={formData[book._id]?.message || ''}
                    onChange={(e) => handleInputChange(book._id, 'message', e.target.value)}
                    placeholder="Optional message"
                    className="w-full p-2 border rounded"
                  />

                  <button
                    onClick={() => handleSwapRequest(book)}
                    className="w-full bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Send Swap Request
                  </button>
                </div>
              ) : (
                <span className="mt-4 inline-block px-3 py-2 rounded bg-gray-400 text-white">
                  Unavailable
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGallery;
