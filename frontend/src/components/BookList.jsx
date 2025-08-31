import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const BookList = ({ books, setBooks, setEditingBook }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axiosInstance.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      alert('Failed to delete book.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4">📚 Book Listings</h2>
      {books.length === 0 ? (
        <p className="text-gray-500">No books available.</p>
      ) : (
        <ul className="space-y-4">
          {books.map((book) => (
            <li
              key={book._id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-700">by {book.author}</p>
                <p className="text-sm text-gray-500">{book.description}</p>
                <p className="text-sm">
                  Condition: <span className="font-medium">{book.condition}</span>
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingBook(book)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
