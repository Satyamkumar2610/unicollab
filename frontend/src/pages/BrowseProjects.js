import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                       p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || p.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="pt-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Projects</h1>
          <p className="text-gray-400">Find amazing projects to collaborate on</p>
        </div>

        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">All Categories</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-app">Mobile App</option>
              <option value="ai-ml">AI/ML</option>
              <option value="research">Research</option>
            </select>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project._id} className="card p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white flex-1">{project.title}</h3>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold">
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="text-sm text-gray-400 mb-4">
                  <p>👤 {project.owner?.name}</p>
                  <p>👥 {project.members?.length || 0} members</p>
                </div>
                {project.requiredSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.requiredSkills.slice(0, 2).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <Link to={`/projects/${project._id}`} className="text-blue-400 hover:text-blue-300 transition text-sm">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-400">No projects found. Try adjusting your search!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProjects;
