import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateProject.css';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    maxMembers: '',
    deadline: '',
    category: '',
    status: 'planning'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
        maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined
      };

      const response = await api.post('/projects', projectData);
      navigate(`/projects/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project">
      <div className="create-project-container">
        <h1>Create New Project</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe your project goals and requirements"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App</option>
                <option value="data-science">Data Science</option>
                <option value="ai-ml">AI/Machine Learning</option>
                <option value="research">Research</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Max Members</label>
              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Python (comma separated)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;