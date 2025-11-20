import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = useCallback(async () => {
    try {
      const response = await api.get('/projects');
      const allProjects = response.data.projects || [];
      const myProjects = allProjects.filter(p =>
        p.owner?._id === user?.id || p.members?.some(m => m._id === user?.id)
      );
      setProjects(myProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">My Projects</h1>
          <Link 
            to="/create-project" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium transform hover:scale-105"
          >
            + Create Project
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    {project.status}
                  </span>
                </div>
                <p className="text-white/80 mb-4 line-clamp-3">{project.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="text-white/70 text-sm">
                    <strong>Role:</strong> {project.owner?._id === user?.id ? 'Owner' : 'Member'}
                  </div>
                  <div className="text-white/70 text-sm">
                    <strong>Members:</strong> {project.members?.length || 0}
                  </div>
                </div>
                <Link 
                  to={`/project/${project._id}`} 
                  className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors font-medium"
                >
                  View Project
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-white/70 mb-6">Start by creating your first project or join existing ones!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/create-project" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Create Project
                </Link>
                <Link 
                  to="/browse" 
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
                >
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
