import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import MyProjects from './pages/MyProjects';
import Competitions from './pages/Competitions';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Home />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/browse" 
              element={isAuthenticated() ? <BrowseProjects /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/project/:id" 
              element={isAuthenticated() ? <ProjectDetails /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/create-project" 
              element={isAuthenticated() ? <CreateProject /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/my-projects" 
              element={isAuthenticated() ? <MyProjects /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/competitions" 
              element={isAuthenticated() ? <Competitions /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;