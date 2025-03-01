import React from 'react';
import './aboutus.css'; // Optional: for styling

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <h1>About Us</h1>
            <p>
                Welcome to [Your Transportation Service Name], your reliable partner for all your travel needs. 
                We provide convenient and affordable transportation solutions for individuals and businesses alike.
            </p>
            <h2>Our Mission</h2>
            <p>
                Our mission is to offer safe, efficient, and comfortable transportation services while ensuring 
                customer satisfaction at every step. We aim to connect people and places with ease and reliability.
            </p>
            <h2>Our Services</h2>
            <ul>
                
                <li>Long-Distance Rides</li>
                <li>Corporate Transportation</li>
                <li>Event Transportation</li>
                <li>Parcel Delivery</li>
            </ul>
            <h2>Why Choose Us?</h2>
            <p>
                - Professional Drivers: Our drivers are trained, vetted, and committed to providing excellent service.<br />
                - Competitive Pricing: We offer transparent and fair pricing with no hidden fees.<br />
                - 24/7 Availability: We’re here for you, day or night, to meet your transportation needs.<br />
                - Easy Booking: Use our website or mobile app for quick and convenient booking.
            </p>
            <h2>Contact Us</h2>
            <p>
                If you have any questions or need assistance, feel free to reach out to us at:
                <br />
                <strong>Email:</strong> support@RidHub.com
                <br />
                <strong>Phone:</strong> +1 (234) 567-8901
            </p>
        </div>
    );
};

export default AboutUs;
