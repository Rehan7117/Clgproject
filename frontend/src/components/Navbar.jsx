// frontend/src/components/Navbar.js
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Handle logout function
  const handleLogout = async () => {
    try {
      logout(); // Call the logout function from AuthContext
      alert('You have been logged out.');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/comPage" className="navbar-link">ComPage</Link>
        <Link to="/about" className="navbar-link">About Us</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
      </div>
      <div className="navbar-center">
        <h1 className="navbar-heading">Transportation Service</h1>
      </div>
      <div className="navbar-right">
        {/* Conditionally render Logout button if user is logged in */}
        {user ? (
          <button onClick={handleLogout} className="navbar-link">
            Logout
          </button>
        ) : (
          // Show Sign up link if no user is logged in
          <Link to="/login" className="navbar-link">Sign up</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
