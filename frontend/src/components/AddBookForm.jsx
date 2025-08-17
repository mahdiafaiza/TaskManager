// src/components/AddBookForm.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AddBookForm = ({ onBookAdded }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      alert('Title and Author are required!');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        '/api/books',
        { title, author, description, condition },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // ✅ pass new book up to parent so it shows instantly
      onBookAdded(res.data);

      // reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setCondition('Good');
    } catch (err) {
      alert('Failed to add book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">Add a Book</h2>

      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option>New</option>
        <option>Good</option>
        <option>Fair</option>
        <option>Poor</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Book'}
      </button>
    </form>
  );
};

export default AddBookForm;
