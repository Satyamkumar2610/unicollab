import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    collaborations: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const projectsResponse = await api.get('/projects');
      const projects = projectsResponse.data.projects || [];

      const userProjects = projects.filter(p =>
        p.owner?._id === user?.id || p.members?.some(m => m._id === user?.id)
      );

      setStats({
        totalProjects: userProjects.length,
        activeProjects: userProjects.filter(p => p.status === 'active').length,
        collaborations: userProjects.filter(p => p.owner?._id !== user?.id).length
      });

      setRecentProjects(userProjects.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-700 mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Student'}! 🚀
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalProjects}</h3>
              <p className="text-gray-600">Total Projects</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.activeProjects}</h3>
              <p className="text-gray-600">Active Projects</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.collaborations}</h3>
              <p className="text-gray-600">Collaborations</p>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
            <Link
              to="/browse"
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              View All →
            </Link>
          </div>
          
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map(project => (
                <div key={project._id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      {project.status}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {project.members?.length || 0} members
                    </span>
                  </div>
                  <Link
                    to={`/project/${project._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    View Project
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-gray-600 mb-6">No projects yet. Start by creating your first project!</p>
              <Link
                to="/create-project"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Project
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/create-project"
              className="bg-white hover:bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Project</h3>
              <p className="text-gray-600">Start a new collaboration</p>
            </Link>
            <Link
              to="/browse"
              className="bg-white hover:bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Projects</h3>
              <p className="text-gray-600">Find projects to join</p>
            </Link>
            <Link
              to="/profile"
              className="bg-white hover:bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Update Profile</h3>
              <p className="text-gray-600">Manage your information</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
