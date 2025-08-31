import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [swapInputs, setSwapInputs] = useState({}); // Track offered book & message per book

  // Fetch all books excluding user's own
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (user?.token) {
          const resMine = await axiosInstance.get('/api/books/mine', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setMyBooks(resMine.data);
        }

        const resAll = await axiosInstance.get('/api/books/all', {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        });
        setBooks(resAll.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, [user]);

  // Swap input handlers
  const handleSwapInputChange = (bookId, field, value) => {
    setSwapInputs({
      ...swapInputs,
      [bookId]: { ...swapInputs[bookId], [field]: value },
    });
  };

  const handleRequestSwapWithDetails = async (book) => {
    const offeredBookId = swapInputs[book._id]?.offeredBookId || null;
    const message = swapInputs[book._id]?.message || '';

    if (!window.confirm(`Do you want to request a swap for "${book.title}"?`)) return;

    try {
      await axiosInstance.post(
        '/api/swap-requests',
        { requestedBookId: book._id, offeredBookId, message },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert('Swap request sent successfully!');
      setBooks(books.map((b) =>
        b._id === book._id ? { ...b, available: false } : b
      ));
      setSwapInputs({ ...swapInputs, [book._id]: { offeredBookId: '', message: '' } });
    } catch (err) {
      console.error('Error requesting swap:', err);
      alert(err.response?.data?.message || 'Failed to request swap.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Hero Section */}
      <section className="text-left mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BookSwap</h1>
        <p className="text-lg md:text-xl text-gray-700">
          Swap, share, and discover books with fellow readers. Find your next great read or exchange
          books you no longer need. Safe, simple, and social!
          
        </p>

        <small>Remember: You will get Book owner's email after they accept your request.</small>
      </section>

      {/* Books Gallery */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Books</h2>
        {books.length === 0 ? (
          <p className="text-gray-500">No books available at the moment.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book._id} className="bg-white p-4 shadow-lg rounded flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="mt-2 text-gray-700">{book.description}</p>
                  <p className="mt-1 text-sm text-gray-500">Condition: {book.condition}</p>
                  <p className="mt-1 text-sm text-gray-500">Status: {book.available ? 'Available' : 'Unavailable'}</p>
                  <p className="mt-1 text-sm text-gray-500">Owner: {book.ownerId?.name || 'Unknown'}</p>
                </div>

                {book.available && user?.token && (
                  <div className="mt-4 space-y-2">
                    <select
                      value={swapInputs[book._id]?.offeredBookId || ''}
                      onChange={(e) => handleSwapInputChange(book._id, 'offeredBookId', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">-- Select your book to offer (optional) --</option>
                      {myBooks.map((b) => (
                        <option key={b._id} value={b._id}>{b.title} ({b.condition})</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Message (optional)"
                      value={swapInputs[book._id]?.message || ''}
                      onChange={(e) => handleSwapInputChange(book._id, 'message', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                      onClick={() => handleRequestSwapWithDetails(book)}
                    >
                      Request Swap
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
