import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-20 text-center text-white text-xl">Loading...</div>;
  if (!user) return <div className="pt-20 text-center text-white text-xl">User not found</div>;

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="max-width-2xl mx-auto">
        <div className="card p-8 animate-slide-up">
          <h1 className="text-4xl font-bold gradient-text mb-2">{user.name}</h1>
          <p className="text-gray-600 mb-8">{user.email}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800">University</h3>
              <p className="text-gray-600">{user.university}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Major</h3>
              <p className="text-gray-600">{user.major}</p>
            </div>
            {user.bio && (
              <div>
                <h3 className="font-bold text-gray-800">Bio</h3>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            )}
            {user.skills?.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
