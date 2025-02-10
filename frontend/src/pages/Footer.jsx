import React, { useState } from 'react';
import './footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/submit-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Query submitted successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Failed to submit query');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="footer-title">RidHub Service</h2>
          <p>Your trusted partner for reliable services and seamless experiences.</p>
        </div>

        <div className="footer-column">
          <h3>About Us</h3>
          <p>RidHub Service is committed to delivering quality services with customer satisfaction at its core.</p>
          <h3>Contact</h3>
          <p>Email: support@ridhub.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123, Business Street, Mumbai, India</p>
        </div>

        <div className="footer-column">
          <form onSubmit={handleSubmit} className="query-form">
          <h3>Have a Question?</h3>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 RideHub Service. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
