import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
      
      <div className="profile-details">
        <div className="detail-item">
          <strong>University:</strong> {user.university}
        </div>
        <div className="detail-item">
          <strong>Major:</strong> {user.major}
        </div>
        {user.bio && (
          <div className="detail-item">
            <strong>Bio:</strong> {user.bio}
          </div>
        )}
        {user.skills && user.skills.length > 0 && (
          <div className="detail-item">
            <strong>Skills:</strong> {user.skills.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;