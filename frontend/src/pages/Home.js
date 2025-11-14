import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#e0e5ec',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', color: '#6c5ce7', marginBottom: '1rem' }}>
          Welcome to UniCollab
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Connect and collaborate with students worldwide
        </p>
        <Link to="/register" style={{
          padding: '1rem 2rem',
          background: 'linear-gradient(145deg, #6c5ce7, #a29bfe)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff'
        }}>
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;