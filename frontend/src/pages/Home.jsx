import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

// Import images
import delhiImg from '../pages/assets/delhi.jpg';
import gujaratImg from '../pages/assets/gujarat.jpg';
import rajasthanImg from '../pages/assets/Rajasthan.jpg';
import biharImg from '../pages/assets/Bihar.jpg';
import karnatakaImg from '../pages/assets/karnataka.jpg';
import kashmirImg from '../pages/assets/kashmir.jpg';

const Home = () => {
  const states = [
    { name: 'Delhi', img: delhiImg },
    { name: 'Mumbai', img: gujaratImg },
    { name: 'Gujrat', img: rajasthanImg },
    { name: 'Kolkatta', img: biharImg },
    { name: 'Karnataka', img: karnatakaImg },
    { name: 'Kashmir', img: kashmirImg },
  ];

  return (
    <div className="home">
      <header className="header">
        <h1>Welcome to Our RidHub Services</h1>
        <p>Reliable pickup and drop services across six states of India.</p>
      </header>

      <section className="services">
        <h2>Our Services</h2>
        <div className="states">
          {states.map((state, index) => (
            <div className="state-card" key={index}>
              <img src={state.img} alt={state.name} />
              <h3>{state.name}</h3>
              <p>We provide fast and safe delivery services in {state.name}.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Why Choose Us?</h2>
        <p>
          We are committed to providing the best transportation services with our fleet of
          trucks operating in Delhi, Gujarat, Rajasthan, Bihar, Karnataka, and Kashmir.
          Contact us today to schedule your delivery!
        </p>
        <Link to="/contact" className="cta-link">
          <button className="cta-button" aria-label="Book service">Book service</button>
        </Link>      
      </section>
    </div>
  );
};

export default Home;
