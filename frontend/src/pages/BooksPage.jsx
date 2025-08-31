import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const BooksPage = () => {
  const { user } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    condition: 'Good',
  });
  const [editingBook, setEditingBook] = useState(null);

  // Fetch books
  useEffect(() => {
    if (!user?.token) return;

    const fetchBooks = async () => {
      try {
        // My books
        const resMine = await axiosInstance.get('/api/books/mine', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMyBooks(resMine.data);

        // All other books
        const resAll = await axiosInstance.get('/api/books/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAllBooks(resAll.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        alert('Failed to fetch books.');
      }
    };

    fetchBooks();
  }, [user]);

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update book
  const handleAddOrUpdateBook = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.condition) {
      alert('Title, author, and condition are required.');
      return;
    }

    try {
      if (editingBook) {
        const res = await axiosInstance.put(`/api/books/${editingBook._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMyBooks(myBooks.map((b) => (b._id === res.data._id ? res.data : b)));
        setEditingBook(null);
      } else {
        const res = await axiosInstance.post('/api/books', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMyBooks([...myBooks, res.data]);
      }

      setFormData({ title: '', author: '', description: '', condition: 'Good' });
    } catch (err) {
      console.error('Error saving book:', err);
      alert(err.response?.data?.message || 'Failed to save book.');
    }
  };

  // Edit book
  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      condition: book.condition,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axiosInstance.delete(`/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMyBooks(myBooks.filter((b) => b._id !== bookId));
    } catch (err) {
      console.error('Error deleting book:', err);
      alert(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  // Request swap
  const handleRequestSwap = async (bookId) => {
    if (!window.confirm('Do you want to request a swap for this book?')) return;

    try {
      const res = await axiosInstance.post(
        '/api/swap-requests',
        { requestedBookId: bookId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log('Swap request created:', res.data);
      alert('Swap request sent successfully!');

      // Mark book unavailable in UI
      setAllBooks(allBooks.map((b) => (b._id === bookId ? { ...b, available: false } : b)));
    } catch (err) {
      console.error('Error requesting swap:', err);
      alert(err.response?.data?.message || 'Failed to request swap.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Books</h1>

      {/* Add/Edit Book Form */}
      <div className="bg-white p-6 shadow-md rounded mb-6">
        <h2 className="text-2xl font-semibold mb-4">{editingBook ? 'Edit Book' : 'Add a New Book'}</h2>
        <form onSubmit={handleAddOrUpdateBook} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      </div>

      {/* My Books */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">My Books</h2>
        {myBooks.length === 0 ? (
          <p className="text-gray-500">You haven't added any books yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBooks.map((book) => (
              <div key={book._id} className="bg-white p-4 shadow-md rounded flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="mt-2">{book.description}</p>
                  <p className="mt-1 text-sm text-gray-500">Condition: {book.condition}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Status: {book.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    onClick={() => handleEditBook(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Books Gallery */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Book Gallery</h2>
        {allBooks.length === 0 ? (
          <p className="text-gray-500">No books available for swap.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBooks.map((book) => (
              <div key={book._id} className="bg-white p-4 shadow-md rounded flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="mt-2">{book.description}</p>
                  <p className="mt-1 text-sm text-gray-500">Condition: {book.condition}</p>
                  <p className="mt-1 text-sm text-gray-500">Owner: {book.ownerId?.name || 'Unknown'}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Status: {book.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                {book.available && (
                  <button
                    className="mt-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    onClick={() => handleRequestSwap(book._id)}
                  >
                    Request Swap
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
