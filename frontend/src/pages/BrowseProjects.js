import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage] = useState(1);
  const limit = 10;

  const trendingProjects = [
    {
      _id: 'trending-1',
      title: 'AI-Powered Study Assistant',
      description: 'Building an intelligent study companion using GPT-4 and machine learning to help students learn more effectively.',
      category: 'ai-ml',
      members: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
      requiredSkills: ['Python', 'TensorFlow', 'React'],
      status: 'active',
      trending: true
    },
    {
      _id: 'trending-2',
      title: 'Campus Event Management Platform',
      description: 'A comprehensive platform for organizing and managing university events, clubs, and student activities.',
      category: 'web-development',
      members: [{ name: 'David' }, { name: 'Emma' }],
      requiredSkills: ['React', 'Node.js', 'MongoDB'],
      status: 'active',
      trending: true
    },
    {
      _id: 'trending-3',
      title: 'Blockchain-Based Certificate Verification',
      description: 'Secure and transparent certificate verification system using blockchain technology for academic credentials.',
      category: 'research',
      members: [{ name: 'Frank' }, { name: 'Grace' }, { name: 'Henry' }, { name: 'Ivy' }],
      requiredSkills: ['Solidity', 'Web3.js', 'React'],
      status: 'active',
      trending: true
    }
  ];

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      params.page = currentPage;
      params.limit = limit;

      const response = await api.get('/projects', { params });
      setProjects(response.data.projects || []);

    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Discover Amazing Projects</h1>
          <p className="text-xl text-white/80">Join collaborative projects and build something incredible together</p>
        </div>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🔥 Trending Projects</h2>
            <p className="text-white/70">Most popular projects this week</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProjects.map(project => (
              <div key={project._id} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Trending
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-white/80 mb-4 line-clamp-3">{project.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-white/70 text-sm">
                    <span className="mr-1">👥</span>
                    {project.members.length} members
                  </span>
                  <span className="flex items-center text-white/70 text-sm">
                    <span className="mr-1">💼</span>
                    {project.requiredSkills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-purple-500/30 text-white px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/project/${project._id}`}
                  className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">All Projects</h2>
            <Link
              to="/create-project"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium transform hover:scale-105"
            >
              + Create Project
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="all" className="bg-gray-800">All Status</option>
                <option value="active" className="bg-gray-800">Active</option>
                <option value="completed" className="bg-gray-800">Completed</option>
                <option value="planning" className="bg-gray-800">Planning</option>
              </select>
            </div>
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
                      <strong>Owner:</strong> {project.owner?.name || 'Unknown'}
                    </div>
                    <div className="text-white/70 text-sm">
                      <strong>Members:</strong> {project.members?.length || 0}
                      {project.maxMembers && `/${project.maxMembers}`}
                    </div>
                    {project.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-purple-500/30 text-white px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <span className="bg-purple-500/30 text-white px-2 py-1 rounded text-xs">
                            +{project.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/project/${project._id}`}
                    className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
                <p className="text-white/70 mb-6">Be the first to create a project!</p>
                <Link
                  to="/create-project"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Create Project
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BrowseProjects;
