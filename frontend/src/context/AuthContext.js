import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for regular user
  const [admin, setAdmin] = useState(null); // State for admin
  const [loading, setLoading] = useState(true); // State for loading during token verification

  // Function to load user and admin from token when the app initializes
  const loadUserFromToken = async () => {
    const userToken = localStorage.getItem('token'); // For regular user
    const adminToken = localStorage.getItem('adminToken'); // For admin

    try {
      if (adminToken) {
        // Fetch admin details based on the admin token
        const response = await axios.get('http://localhost:3001/api/admin/me', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setAdmin(response.data.admin); // Set admin data
      } else if (userToken) {
        // Fetch regular user details based on the user token
        const response = await axios.get('http://localhost:3001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUser(response.data.user); // Set user data
      }
    } catch (error) {
      console.error('Error loading user or admin from token:', error);
      // Remove invalid tokens
      if (adminToken) localStorage.removeItem('adminToken');
      if (userToken) localStorage.removeItem('token');
    } finally {
      setLoading(false); // Set loading to false once processing is complete
    }
  };

  // Call loadUserFromToken on component mount
  useEffect(() => {
    loadUserFromToken();
  }, []);

  // Regular user registration function
  const register = async (firstName, lastName, username, email, phone, password) => {
    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        firstName,
        lastName,
        username,
        email,
        phone,
        password,
      });
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('User registration failed:', error);
      alert('Registration failed! Please try again.');
    }
  };

  // Regular user login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });
      setUser(response.data.user); // Set the logged-in user
      localStorage.setItem('token', response.data.token); // Save token in local storage
      alert('Login successful!');
    } catch (error) {
      console.error('User login failed:', error);
      alert('Login failed! Please check your credentials.');
    }
  };

  // Admin registration function
  const adminRegister = async (username, password) => {
    try {
      await axios.post('http://localhost:3001/api/admin/register', { username, password });
      alert('Admin registration successful! Please log in.');
    } catch (error) {
      console.error('Admin registration failed:', error);
      alert('Admin registration failed! Please try again.');
    }
  };

  // Admin login function
  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/admin/login', { username, password });
      setAdmin(response.data.admin); // Set the logged-in admin
      localStorage.setItem('adminToken', response.data.token); // Save admin token in local storage
      alert('Admin login successful!');
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Admin login failed! Please check your credentials.');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('token'); // Remove user token from local storage
    localStorage.removeItem('adminToken'); // Remove admin token from local storage
  };

  // Auth context value
  const value = {
    user,
    admin,
    register,
    login,
    adminRegister,
    adminLogin,
    logout,
  };

  if (loading) {
    // Show a loading indicator while verifying tokens
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
