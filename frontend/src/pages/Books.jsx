// src/pages/Books.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import AddBookForm from '../components/AddBookForm';

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch books for logged-in user
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get('/api/books', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBooks(response.data);
      } catch (error) {
        alert('Failed to fetch books.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBooks();
  }, [user]);

  // handler for adding a new book (called from AddBookForm)
  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      
      {/* form for adding a book */}
      <AddBookForm onBookAdded={handleBookAdded} />

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books yet. Add your first one above!</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {books.map((book) => (
            <li
              key={book._id}
              className="p-4 border rounded bg-white shadow"
            >
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-gray-700">Author: {book.author}</p>
              <p className="text-gray-600">Condition: {book.condition}</p>
              {book.description && (
                <p className="text-gray-500 mt-1">{book.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Books;
