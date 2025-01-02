import React, { useState } from 'react';
import axios from 'axios';

const UpdateOrder = ({ onStatusUpdate }) => {
  const [bookingId, setBookingId] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.put(`http://localhost:3001/api/bookings/${bookingId}`, { status });

      setMessage(`Status updated successfully: ${response.data.status}`);
      if (status === 'Delivered') {
        setMessage(
          `Status updated successfully: ${response.data.status} with Delivered Date: ${new Date(
            response.data.deliveredDate
          ).toLocaleDateString()}`
        );
      }
      if (onStatusUpdate) onStatusUpdate(); // Notify parent to refresh bookings
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err.response?.data?.message || 'Failed to update status. Please try again.');
    }
  };

  return (
    <div className="update-order-container">
      <h2>Update Booking Status</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Booking ID:</label>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <button type="submit">Update Status</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateOrder;
