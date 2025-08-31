import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const SwapRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.token) return;
      try {
        const response = await axiosInstance.get('/api/swaps', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRequests(response.data);
      } catch (error) {
        alert('Failed to fetch swap requests.');
      }
    };

    fetchRequests();
  }, [user]);

  const handleRespond = async (id, status) => {
    try {
      const response = await axiosInstance.put(
        `/api/swaps/${id}/respond`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRequests(requests.map(r => (r._id === id ? response.data : r)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to respond.');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/api/swaps/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRequests(requests.map(r => (r._id === id ? response.data : r)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete swap.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Swap Requests Dashboard</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No swap requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r._id} className="bg-white p-4 shadow-md rounded">
              <p>
                <strong>{r.requesterId.name}</strong> requested{' '}
                <strong>{r.requestedBookId.title}</strong> from{' '}
                <strong>{r.ownerId.name}</strong>
              </p>
              {r.offeredBookId && (
                <p>
                  Offered: <strong>{r.offeredBookId.title}</strong>
                </p>
              )}
              <p>Message: {r.message || '—'}</p>
              <p>Status: <span className="font-semibold">{r.status}</span></p>

              {/* If you are the owner and status is pending */}
              {r.ownerId._id === user._id && r.status === 'pending' && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleRespond(r._id, 'accepted')}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(r._id, 'rejected')}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* If you are requester or owner and status is accepted */}
              {['accepted'].includes(r.status) &&
                (r.ownerId._id === user._id || r.requesterId._id === user._id) && (
                  <button
                    onClick={() => handleComplete(r._id)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Mark as Completed
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapRequests;
