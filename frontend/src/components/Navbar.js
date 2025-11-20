import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white">🎓 UniCollab</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-white hover:text-purple-200 font-medium">Dashboard</Link>
              <Link to="/browse" className="text-white hover:text-purple-200 font-medium">Browse</Link>
              <Link to="/my-projects" className="text-white hover:text-purple-200 font-medium">My Projects</Link>
              <Link to="/create-project" className="text-white hover:text-purple-200 font-medium">Create</Link>
              <button onClick={() => { logout(); window.location.href = '/'; }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium">Logout</button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-purple-200 font-medium">Log In</Link>
              <Link to="/register" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
