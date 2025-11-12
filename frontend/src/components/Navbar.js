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
        
        {localStorage.getItem('token') ? (
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/browse" className="nav-link">Browse</Link>
            <Link to="/my-projects" className="nav-link">My Projects</Link>
            <Link to="/create-project" className="nav-link">Create</Link>
            <Link to="/competitions" className="nav-link">Competitions</Link>
            <button onClick={() => {localStorage.removeItem('token'); window.location.href='/';}} className="nav-button logout">
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