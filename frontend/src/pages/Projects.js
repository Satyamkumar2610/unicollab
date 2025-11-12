import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/projects?status=${filter}&search=${search}`);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <Link to="/projects/create" className="create-btn">
          Create New Project
        </Link>
      </div>

      <div className="projects-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Projects
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className={`status ${project.status}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              <div className="project-details">
                <div className="detail">
                  <strong>Skills:</strong> {project.requiredSkills?.join(', ') || 'None specified'}
                </div>
                <div className="detail">
                  <strong>Members:</strong> {project.members?.length || 0}/{project.maxMembers || 'Unlimited'}
                </div>
                <div className="detail">
                  <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="project-actions">
                <Link to={`/projects/${project._id}`} className="view-btn">
                  View Details
                </Link>
                {project.members?.length < project.maxMembers && (
                  <button className="join-btn">Join Project</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <Link to="/projects/create" className="create-btn">
            Create the first project
          </Link>
        </div>
      )}
    </div>
  );
};

export default Projects;