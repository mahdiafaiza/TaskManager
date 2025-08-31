import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">BookSwap</Link>
      <div>
        {user ? (
          <>
            {/* ✅ Updated Books link */}
            <Link to="/" className="mr-4">Gallery</Link>
            <Link to="/books" className="mr-4">Books</Link>
            {/* ✅ New Requests link */}
      <Link to="/swap-requests/owner" className="mr-4 text-white font-semibold hover:text-blue-400">
          Swap Requests
        </Link>
        <Link to="/swap-requests/requester" className=" mr-4 text-white font-semibold hover:text-blue-400">
          My Requests
        </Link>
            <Link to="/profile" className="mr-4 px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition">username:  <span>
          {user.name}
              </span></Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
