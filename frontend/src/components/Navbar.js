import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          UniCollab
        </Link>
        
        {user ? (
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="nav-button logout">
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-menu">
            <Link to="/login" className="nav-button">Log In</Link>
            <Link to="/register" className="nav-button primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;