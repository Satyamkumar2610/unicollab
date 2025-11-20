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
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-700 mt-4 text-center">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Projects
          </h1>
          <p className="text-xl text-gray-600">Join collaborative projects and build something incredible together</p>
        </div>

        {/* Trending Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🔥 Trending Projects</h2>
            <p className="text-gray-600">Most popular projects this week</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProjects.map(project => (
              <div key={project._id} className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Trending
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-gray-500 text-sm">
                    <span className="mr-1">👥</span>
                    {project.members.length} members
                  </span>
                  <span className="flex items-center text-gray-500 text-sm">
                    <span className="mr-1">💼</span>
                    {project.requiredSkills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/project/${project._id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* All Projects Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">All Projects</h2>
            <Link
              to="/create-project"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium transform hover:scale-105"
            >
              + Create Project
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="planning">Planning</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="text-gray-500 text-sm">
                      <strong>Owner:</strong> {project.owner?.name || 'Unknown'}
                    </div>
                    <div className="text-gray-500 text-sm">
                      <strong>Members:</strong> {project.members?.length || 0}
                      {project.maxMembers && `/${project.maxMembers}`}
                    </div>
                    {project.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            +{project.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/project/${project._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">Be the first to create a project!</p>
                <Link
                  to="/create-project"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
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
