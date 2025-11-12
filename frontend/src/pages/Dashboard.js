import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({ name: 'Student' });
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    collaborations: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats({
      totalProjects: 5,
      activeProjects: 3,
      collaborations: 2
    });
    setRecentProjects([
      {
        _id: '1',
        title: 'E-Learning Platform',
        description: 'Building a modern e-learning platform with React and Node.js',
        status: 'active',
        members: [{ name: 'John' }, { name: 'Jane' }]
      },
      {
        _id: '2',
        title: 'Mobile App Development',
        description: 'Creating a mobile app for student collaboration',
        status: 'planning',
        members: [{ name: 'Alice' }]
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your projects</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalProjects}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeProjects}</h3>
          <p>Active Projects</p>
        </div>
        <div className="stat-card">
          <h3>{stats.collaborations}</h3>
          <p>Collaborations</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Projects</h2>
          <Link to="/projects" className="view-all">View All</Link>
        </div>
        
        {recentProjects.length > 0 ? (
          <div className="projects-grid">
            {recentProjects.map(project => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span className="status">{project.status}</span>
                  <span className="members">{project.members?.length || 0} members</span>
                </div>
                <Link to={`/projects/${project._id}`} className="project-link">
                  View Project
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No projects yet. Start by creating your first project!</p>
            <Link to="/projects/create" className="create-button">
              Create Project
            </Link>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/projects/create" className="action-card">
            <h3>Create Project</h3>
            <p>Start a new collaboration</p>
          </Link>
          <Link to="/projects" className="action-card">
            <h3>Browse Projects</h3>
            <p>Find projects to join</p>
          </Link>
          <Link to="/profile" className="action-card">
            <h3>Update Profile</h3>
            <p>Manage your information</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;