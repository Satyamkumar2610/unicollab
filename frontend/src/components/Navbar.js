import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          UniCollab
        </Link>
        
        {isAuthenticated ? (
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/browse" className="nav-link">Browse</Link>
            <Link to="/my-projects" className="nav-link">My Projects</Link>
            <Link to="/create-project" className="nav-link">Create</Link>
            <Link to="/competitions" className="nav-link">Competitions</Link>
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