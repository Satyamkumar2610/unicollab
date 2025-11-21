import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import MyProjects from './pages/MyProjects';
import Competitions from './pages/Competitions';
import Profile from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Explore } from './pages/Explore';
import { Teams } from './pages/Teams';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-white">Loading...</p></div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><BrowseProjects /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><BrowseProjects /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
      <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
      <Route path="/competitions" element={<ProtectedRoute><Competitions /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
