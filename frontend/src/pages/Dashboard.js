import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProjects: 0, activeProjects: 0, collaborations: 0 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects?.slice(0, 3) || []);
      setStats({
        totalProjects: response.data.projects?.length || 0,
        activeProjects: response.data.projects?.filter(p => p.status === 'active').length || 0,
        collaborations: response.data.projects?.length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to UniCollab</h1>
          <p className="text-gray-400">Collaborate, Create, and Innovate Together</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Projects', value: stats.totalProjects, icon: '📊' },
            { label: 'Active Projects', value: stats.activeProjects, icon: '🚀' },
            { label: 'Collaborations', value: stats.collaborations, icon: '👥' }
          ].map((stat, i) => (
            <div key={i} className="card p-6 hover:shadow-xl transition">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
            <Link to="/projects" className="text-blue-400 hover:text-blue-300 transition">
              View All →
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition">
                  <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded text-xs font-semibold">
                      {project.status}
                    </span>
                    <Link to={`/projects/${project._id}`} className="text-blue-400 hover:text-blue-300 transition text-sm">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No projects yet. Create one to get started!</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Create Project', desc: 'Start a new collaboration', link: '/projects/create' },
            { title: 'Browse Projects', desc: 'Find projects to join', link: '/projects' },
            { title: 'My Profile', desc: 'Manage your information', link: '/profile' }
          ].map((action, i) => (
            <Link key={i} to={action.link} className="card p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
              <p className="text-gray-400">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
