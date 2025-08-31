import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AddBookForm = ({ books, setBooks, editingBook, setEditingBook }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    condition: 'Good',
  });

  // If editing, load book data into form
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        description: editingBook.description,
        condition: editingBook.condition,
      });
    } else {
      setFormData({ title: '', author: '', description: '', condition: 'Good' });
    }
  }, [editingBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return alert('You must be logged in.');

    try {
      if (editingBook) {
        // Update existing book
        const response = await axiosInstance.put(
          `/api/books/${editingBook._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setBooks(books.map(b => (b._id === response.data._id ? response.data : b)));
      } else {
        // Add new book
        const response = await axiosInstance.post('/api/books', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBooks([...books, response.data]);
      }

      // Reset form
      setEditingBook(null);
      setFormData({ title: '', author: '', description: '', condition: 'Good' });
    } catch (error) {
      alert('Failed to save book.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingBook ? 'Edit Book' : 'Add Book'}
      </h1>

      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Author"
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <select
        value={formData.condition}
        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="New">New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Poor">Poor</option>
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingBook ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default AddBookForm;
