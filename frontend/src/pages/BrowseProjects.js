import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className="browse-projects">
      <h1>Browse Projects</h1>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              <span>Owner: {project.owner?.name}</span>
              <span>Members: {project.members?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseProjects;