// src/pages/SwapRequests.jsx
import { useEffect, useState } from 'react';

function SwapRequests() {
  const [requests, setRequests] = useState([]);

  // Fetch swap requests
  useEffect(() => {
    fetch('/api/swap-requests')
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  // Respond to a request
  const handleResponse = async (id, status) => {
    try {
      const res = await fetch(`/api/swap-requests/${id}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setRequests(
        requests.map((req) => (req._id === updated._id ? updated : req))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Mark a swap as completed
  const handleComplete = async (id) => {
    try {
      const res = await fetch(`/api/swap-requests/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const updated = await res.json();
      setRequests(
        requests.map((req) => (req._id === updated._id ? updated : req))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Swap Requests</h2>
      <ul>
        {requests.map((req) => (
          <li key={req._id} className="border p-3 mb-3 rounded">
            <p>
              <strong>Requester:</strong> {req.requesterId?.name} <br />
              <strong>Book:</strong> {req.requestedBookId?.title} by{' '}
              {req.requestedBookId?.author} <br />
              <strong>Status:</strong> {req.status}
            </p>

            {req.status === 'pending' && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleResponse(req._id, 'accepted')}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(req._id, 'rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {req.status === 'accepted' && (
              <button
                onClick={() => handleComplete(req._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
              >
                Mark as Completed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SwapRequests;