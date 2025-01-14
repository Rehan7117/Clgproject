import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/bookings');
      setBookings(response.data);
      setFilteredBookings(response.data); // Initially, show all bookings
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(
        (booking) =>
          new Date(booking.createdAt).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
      );
    }

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filterDate, filterStatus]);

  return (
    <div className="booking-list-container">
      <h2>All Bookings</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Filters */}
      <div className="filters">
        <label>
          Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <label>
          Status:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            {/* <option value="Active">Active</option> */}
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="booking-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Pickup</th>
              <th>Pickup Phone</th>
              <th>Drop</th>
              <th>Drop Phone</th>
              <th>Booking Date</th> {/* Updated column name */}
              <th>Price</th>
              <th>Status</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.username}</td>
                <td>{booking.email}</td>
                <td>{booking.pickupLocation}</td>
                <td>{booking.pickupPhone || 'N/A'}</td>
                <td>{booking.dropLocation}</td>
                <td>{booking.dropPhone || 'N/A'}</td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td> {/* Display createdAt */}
                <td>₹{booking.price}</td>
                <td>{booking.status || 'Pending'}</td>
                <td>
                  {booking.image ? (
                    <img
                      src={`http://localhost:3001/${booking.image}`}
                      alt="Booking"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllBookings;
