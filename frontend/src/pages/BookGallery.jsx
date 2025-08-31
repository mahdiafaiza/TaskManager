import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  // Fetch all books excluding user's own
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosInstance.get('/api/books/all', {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        });
        setBooks(res.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, [user]);

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">📚 Welcome to BookSwap</h1>
        <p className="text-lg md:text-xl text-gray-700">
          Swap, share, and discover books with fellow readers. Find your next great read or exchange
          books you no longer need. Safe, simple, and social!
        </p>
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
                  <p className="mt-1 text-sm text-gray-500">
                    Status: {book.available ? 'Available' : 'Unavailable'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Owner: {book.ownerId?.name || 'Unknown'}
                  </p>
                </div>
                {book.available && user?.token && (
                  <button
                    className="mt-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    onClick={async () => {
                      try {
                        const res = await axiosInstance.post(
                          `/api/books/${book._id}/request-swap`,
                          {},
                          { headers: { Authorization: `Bearer ${user.token}` } }
                        );
                        alert(res.data.message);
                        setBooks(books.map((b) => (b._id === book._id ? { ...b, available: false } : b)));
                      } catch (err) {
                        alert(err.response?.data?.message || 'Failed to request swap');
                      }
                    }}
                  >
                    Request Swap
                  </button>
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
