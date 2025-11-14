import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e0e5ec',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#e0e5ec',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'
      }}>
        <h1 style={{ color: '#6c5ce7', marginBottom: '1rem' }}>
          Welcome, {user?.name || 'User'}!
        </h1>
        <p style={{ color: '#666' }}>
          Your dashboard is ready. Start collaborating on projects!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;