import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Invoice from './Invoice';
import './bookinglist.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleBookings, setVisibleBookings] = useState({});

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle visibility of bookings for a specific username
  const toggleBookingsVisibility = (username) => {
    setVisibleBookings((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="booking-list-container">
      <h2>All Bookings</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="booking-list-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              bookings.reduce((acc, booking) => {
                if (!acc[booking.username]) acc[booking.username] = [];
                acc[booking.username].push(booking);
                return acc;
              }, {})
            ).map(([username, userBookings]) => (
              <React.Fragment key={username}>
                <tr>
                  <td>{username}</td>
                  <td>
                    <button onClick={() => toggleBookingsVisibility(username)}>
                      {visibleBookings[username] ? 'Hide Bookings' : 'Show Bookings'}
                    </button>
                  </td>
                  <td>
                    {visibleBookings[username] && (
                      <table className="nested-booking-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Pickup</th>
                            <th>Pickup Phone</th>
                            <th>Drop</th>
                            <th>Drop Phone</th>
                            <th>Booking Date</th>
                            <th>Price</th>
                            <th>Goods Type</th> {/* New Goods Type column */}
                            <th>Payment Method</th> {/* New Payment Method column */}
                            <th>Status</th>
                            <th>Delivered Date</th>
                            <th>Image</th>
                            <th>Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userBookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>{booking._id}</td>
                              <td>{booking.email}</td>
                              <td>{booking.pickupLocation}</td>
                              <td>{booking.pickupPhone || 'N/A'}</td>
                              <td>{booking.dropLocation}</td>
                              <td>{booking.dropPhone || 'N/A'}</td>
                              <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                              <td>₹{booking.price}</td>
                              <td>{booking.goodsType || 'N/A'}</td> {/* Display Goods Type */}
                              <td>{booking.paymentMethod || 'N/A'}</td> {/* Display payment method */}
                              <td>{booking.status || 'Pending'}</td>
                              <td>
                                {booking.status === 'Delivered'
                                  ? new Date(booking.deliveredDate).toLocaleDateString()
                                  : 'N/A'}
                              </td>
                              <td>
                                {booking.image ? (
                                  <img
                                    src={`http://localhost:3001/${booking.image}`}
                                    alt="Booking"
                                    className="booking-image"
                                  />
                                ) : (
                                  'No Image'
                                )}
                              </td>
                              <td>
                                <Invoice bookingData={booking} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
