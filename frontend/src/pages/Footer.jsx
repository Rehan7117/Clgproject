import React, { useState } from 'react';
import './footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Query submitted successfully!');
    setFormData({ name: '', email: '', message: '' });
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
          <h3>Have a Question?</h3>
          <form onSubmit={handleSubmit} className="query-form">
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
        <p>© 2024 RidHub Service. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
