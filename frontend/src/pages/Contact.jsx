import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Invoice from './Invoice'; // Import the Invoice component
import './contact.css';

const Contact = () => {
  const { user } = useAuth();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [dropPhone, setDropPhone] = useState('');
  const [goodsType, setGoodsType] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState(0);
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [image, setImage] = useState(null); // State for uploaded image

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const calculatePrice = () => {
    if (!weight) {
      setPrice(0);
      return;
    }

    const basePrice = 0;
    const distanceFactor = pickupLocation === dropLocation ? 0.8 : 1;
    const typeFactor = goodsType === 'Fragile' ? 1.5 : 1;

    let weightIncrement = 500;
    let weightFactor = 0;

    if (weight === '0-500kg') {
      weightFactor = 1;
    } else if (weight === '500-1000kg') {
      weightFactor = 2;
    } else if (weight === '1000-1500kg') {
      weightFactor = 3;
    } else if (weight === '1500-2000kg') {
      weightFactor = 4;
    } else if (weight === 'Over 2000kg') {
      weightFactor = 5;
    }

    const calculatedWeightPrice = weightFactor * weightIncrement;
    const calculatedPrice =
      basePrice * distanceFactor * typeFactor + calculatedWeightPrice;
    setPrice(calculatedPrice);
  };

  useEffect(() => {
    calculatePrice();
  }, [pickupLocation, dropLocation, goodsType, weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('pickupLocation', pickupLocation);
    formData.append('dropLocation', dropLocation);
    formData.append('pickupPhone', pickupPhone);
    formData.append('dropPhone', dropPhone);
    formData.append('goodsType', goodsType);
    formData.append('weight', weight);
    formData.append('price', price);
    formData.append('email', email);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:3001/api/bookings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Booking Confirmed!');
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Error creating booking. Please try again.');
    }
  };

  const bookingData = {
    username,
    email,
    pickupLocation,
    pickupPhone,
    dropLocation,
    dropPhone,
    goodsType,
    weight,
    price,
    image,
  };

  return (
    <div className="contact-us-container">
      <h2>Book a Truck</h2>
      {!bookingConfirmed ? (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Pickup Location:</label>
            <input
              type="text"
              value={pickupLocation}
              placeholder="Pickup only from Pune"
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Pickup Phone:</label>
            <input
              type="tel"
              value={pickupPhone}
              onChange={(e) => setPickupPhone(e.target.value)}
              required
              placeholder="Enter pickup phone number"
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
            />
          </div>
          <div className="form-group">
            <label>Drop Location:</label>
            <select
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              required
            >
              <option value="">Select Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Surat">Surat</option>
            </select>
          </div>
          <div className="form-group">
            <label>Drop Phone:</label>
            <input
              type="tel"
              value={dropPhone}
              onChange={(e) => setDropPhone(e.target.value)}
              required
              placeholder="Enter drop phone number"
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
            />
          </div>
          <div className="form-group">
            <label>Goods Type:</label>
            <select
              value={goodsType}
              onChange={(e) => setGoodsType(e.target.value)}
              required
            >
              <option value="">Select Goods Type</option>
              <option value="Fragile">Fragile</option>
              <option value="Solid">Solid</option>
              <option value="Liquid">Liquid</option>
            </select>
          </div>
          <div className="form-group">
            <label>Weight:</label>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            >
              <option value="">Select Weight</option>
              <option value="0-500kg">0-500kg</option>
              <option value="500-1000kg">500-1000kg</option>
              <option value="1000-1500kg">1000-1500kg</option>
              <option value="1500-2000kg">1500-2000kg</option>
              <option value="Over 2000kg">Over 2000kg</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="number" value={price} readOnly />
          </div>
          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button type="submit" className="submit-btn">
            Confirm Booking
          </button>
        </form>
      ) : (
        <Invoice bookingData={bookingData} />
      )}
    </div>
  );
};

export default Contact;
 // AIzaSyAVKMaD2kNC6TjgozA3QL8YlHb7iDSP3_c