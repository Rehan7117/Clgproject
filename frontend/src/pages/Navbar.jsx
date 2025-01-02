// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-link">Home</Link>
        {/* Conditionally render admin link if user is an admin */}
        {user && user.isAdmin && (
          <Link to="/admin/dashboard" className="navbar-link">Admin Dashboard</Link>
        )}
        <Link to="/contact" className="navbar-link">Contact</Link>
        <Link to="/about" className="navbar-link">About Us</Link>
        {user && <Link to="/history" className="navbar-link">Booking History</Link>} 
      </div>
      <div className="navbar-center">
        <h1 className="navbar-heading">Transportation Service</h1>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-welcome">Hello, {user.username}</span>
            <button onClick={handleLogout} className="navbar-link logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
