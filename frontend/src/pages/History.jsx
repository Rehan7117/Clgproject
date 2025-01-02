import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you have AuthContext to get logged-in user
import Invoice from './Invoice'; // Assuming the Invoice component is in the same directory
import './history.css'; // Ensure this file exists and is properly styled

const History = () => {
  const { user } = useAuth(); // Get the current logged-in user from context
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleBookings, setVisibleBookings] = useState({}); // State to track visibility of user bookings

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on the logged-in user
  const filteredBookings = bookings.filter((booking) => booking.username === user?.username);

  // Toggle visibility of bookings for a specific user
  const toggleBookingsVisibility = (username) => {
    setVisibleBookings((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/bookings/cancel/${bookingId}`);
      if (response.status === 200) {
        // Update the bookings list to reflect the cancellation
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: 'Cancelled' } : booking
          )
        );
        alert('Booking cancelled successfully.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel the booking.');
    }
  };

  return (
    <div className="history-container">
      <h2>Your Booking History</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {/* Group bookings by username */}
            {Object.entries(
              filteredBookings.reduce((acc, booking) => {
                if (!acc[booking.username]) {
                  acc[booking.username] = [];
                }
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
                      <table className="nested-history-table">
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Pickup Location</th>
                            <th>Pickup Phone</th>
                            <th>Drop Location</th>
                            <th>Drop Phone</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userBookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>{booking.email}</td>
                              <td>{booking.pickupLocation}</td>
                              <td>{booking.pickupPhone}</td>
                              <td>{booking.dropLocation}</td>
                              <td>{booking.dropPhone}</td>
                              <td>{new Date(booking.date).toLocaleDateString()}</td>
                              <td>₹{booking.price}</td>
                              <td>{booking.status || 'Active'}</td>
                              <td>
                                {booking.status !== 'Cancelled' && (
                                  <button
                                    className="cancel-button"
                                    onClick={() => handleCancelBooking(booking._id)}
                                  >
                                    Cancel
                                  </button>
                                )}
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

export default History;
