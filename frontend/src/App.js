import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './pages/Footer';
import UserList from './pages/UserList';
import Contact from './pages/Contact';
import BookingList from './pages/BookingList';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminRegister from './Admin/AdminRegister';
import ProtectedRoute from './Admin/ProtectedRoute';
import AboutUs from './pages/Aboutus';
import History from './pages/History';
import UpdateOrder from './Admin/UpdateOrder'; // Import UpdateOrder component
import AllBookings from './Admin/AllBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/history" element={<History />} />

          {/* Protect UpdateOrder Route */}
          <Route 
            path="/update-order" 
            element={
              <ProtectedRoute>
                <UpdateOrder />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/bookings" element={<AllBookings />} />


          {/* Protect User List and Booking List */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookinglist" 
            element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            } 
          />

          {/* Admin Dashboard - Protected */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
