import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MySwapRequestsPage = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    const fetchMyRequests = async () => {
      try {
        const res = await axiosInstance.get('/api/swap-requests/requester', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMyRequests(res.data);
      } catch (err) {
        console.error('Error fetching my swap requests:', err);
        alert('Failed to fetch your swap requests.');
      }
    };

    fetchMyRequests();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Swap Requests</h1>

      {myRequests.length === 0 ? (
        <p>You haven't made any swap requests yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRequests.map((req) => (
            <div key={req._id} className="bg-white p-4 shadow-md rounded flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{req.requestedBookId?.title}</h3>
                <p className="text-gray-600">by {req.requestedBookId?.author}</p>
                <p className="mt-1 text-sm text-gray-500">Owner: {req.ownerId?.name}</p>
                {req.status === 'accepted' && (
                  <p className="mt-1 text-sm text-gray-700 font-semibold">
                    Owner Email: {req.ownerId?.email}
                  </p>
                )}
                <p className="mt-2 text-sm">Message: {req.message || 'No message'}</p>
                <p className="mt-1 font-semibold">Status: {req.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySwapRequestsPage;
