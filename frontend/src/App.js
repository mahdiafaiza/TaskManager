import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';  
import BookGallery from './pages/BookGallery';
import BooksPage from './pages/BooksPage';
import MySwapRequestsPage from './pages/MySwapRequestsPage';
import SwapRequestsOwnerPage from './pages/SwapRequestsOwnerPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/books" element={<BooksPage/>} />
        <Route path="/" element={<BookGallery/>} />
        <Route path="/swap-requests/owner" element={<SwapRequestsOwnerPage />} />
        <Route path="/swap-requests/requester" element={<MySwapRequestsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
