import React, { useState } from 'react';
import UserList from '../pages/UserList';
import BookingList from '../pages/BookingList';
import AdminRegister from '../Admin/AdminRegister';
import UpdateOrder from '../Admin/UpdateOrder';
import AllBookings from '../Admin/AllBookings';
import AdminQueries from '../Admin/AdminQueries'; // ✅ Import AdminQueries
import './adminDashboard.css';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('users');

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <UserList />;
      case 'bookings':
        return <BookingList />;
      case 'all-bookings':
        return <AllBookings />;
      case 'register':
        return <AdminRegister />;
      case 'update-order':
        return <UpdateOrder />;
      case 'queries': // ✅ Case for AdminQueries
        return <AdminQueries />;
      default:
        return <UserList />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li className={activePage === 'users' ? 'active' : ''} onClick={() => setActivePage('users')}>
            Users
          </li>
          <li className={activePage === 'bookings' ? 'active' : ''} onClick={() => setActivePage('bookings')}>
            User Bookings
          </li>
          <li className={activePage === 'all-bookings' ? 'active' : ''} onClick={() => setActivePage('all-bookings')}>
            All Bookings
          </li>
          <li className={activePage === 'register' ? 'active' : ''} onClick={() => setActivePage('register')}>
            Register Admin
          </li>
          <li className={activePage === 'update-order' ? 'active' : ''} onClick={() => setActivePage('update-order')}>
            Update Order
          </li>
          <li className={activePage === 'queries' ? 'active' : ''} onClick={() => setActivePage('queries')}>
            User Queries {/* ✅ New Sidebar Option */}
          </li>
        </ul>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
