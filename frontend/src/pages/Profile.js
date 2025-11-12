import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    major: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        university: user.university || '',
        major: user.major || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        github: user.github || '',
        linkedin: user.linkedin || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      await api.put('/users/profile', updateData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>University *</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Major *</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>About You</h2>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell others about yourself, your interests, and what you're looking for in collaborations..."
              />
            </div>
            
            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Python, Machine Learning (comma separated)"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Social Links</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https:
                />
              </div>
              
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https:
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="save-btn"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;