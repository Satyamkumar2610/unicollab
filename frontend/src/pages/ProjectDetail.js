import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    try {
      await api.post(`/projects/${id}/join`);
      fetchProject();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join project');
    }
  };

  const handleLeaveProject = async () => {
    try {
      await api.post(`/projects/${id}/leave`);
      fetchProject();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to leave project');
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (error) {
    return <div className="error-page">{error}</div>;
  }

  if (!project) {
    return <div className="error-page">Project not found</div>;
  }

  const isOwner = project.owner?._id === user?._id;
  const isMember = project.members?.some(member => member._id === user?._id);
  const canJoin = !isMember && (!project.maxMembers || project.members?.length < project.maxMembers);

  return (
    <div className="project-detail">
      <div className="project-header">
        <div className="header-content">
          <h1>{project.title}</h1>
          <div className="project-meta">
            <span className={`status ${project.status}`}>{project.status}</span>
            <span className="category">{project.category}</span>
          </div>
        </div>
        
        <div className="project-actions">
          {isOwner && (
            <button className="edit-btn">Edit Project</button>
          )}
          {canJoin && (
            <button onClick={handleJoinProject} className="join-btn">
              Join Project
            </button>
          )}
          {isMember && !isOwner && (
            <button onClick={handleLeaveProject} className="leave-btn">
              Leave Project
            </button>
          )}
        </div>
      </div>

      <div className="project-content">
        <div className="main-content">
          <section className="description-section">
            <h2>Description</h2>
            <p>{project.description}</p>
          </section>

          <section className="skills-section">
            <h2>Required Skills</h2>
            <div className="skills-list">
              {project.requiredSkills?.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </section>

          <section className="members-section">
            <h2>Team Members ({project.members?.length || 0})</h2>
            <div className="members-list">
              {project.members?.map(member => (
                <div key={member._id} className="member-card">
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.university}</p>
                    <p>{member.major}</p>
                  </div>
                  {member._id === project.owner?._id && (
                    <span className="owner-badge">Owner</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="sidebar">
          <div className="project-info">
            <h3>Project Info</h3>
            <div className="info-item">
              <strong>Owner:</strong>
              <span>{project.owner?.name}</span>
            </div>
            <div className="info-item">
              <strong>Created:</strong>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            {project.deadline && (
              <div className="info-item">
                <strong>Deadline:</strong>
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="info-item">
              <strong>Members:</strong>
              <span>
                {project.members?.length || 0}
                {project.maxMembers && `/${project.maxMembers}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;