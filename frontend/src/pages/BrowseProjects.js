import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingState, EmptyState, ErrorState } from '../components';
import { useDebounce } from '../hooks/useDebounce';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const WrenchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);


const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    skills: '',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.skills) params.append('skills', filters.skills);

      const response = await api.get(`/projects?${params.toString()}`);
      setProjects(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.category, filters.skills]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Discover Projects</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find innovative projects and collaborate with talented students and professionals.
          </p>
        </header>

        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search by title or keyword..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
            </div>
            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App</option>
                <option value="ai-ml">AI/ML</option>
                <option value="research">Research</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                name="skills"
                placeholder="Filter by skills (e.g. React,Node.js)"
                value={filters.skills}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <WrenchIcon />
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Fetching latest projects..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Projects Found"
            message="No projects match your current filters. Try a different search!"
          />
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project._id}`} className="block group">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            project.status === 'open' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {project.status}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
      </div>
      <div className="px-6 pt-2 pb-6 border-t border-gray-100 dark:border-gray-700">
        {project.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-semibold">Skills:</span>
            {project.requiredSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                {skill}
              </span>
            ))}
            {project.requiredSkills.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
                +{project.requiredSkills.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            <span className="font-semibold">Owner:</span> {project.owner?.name || 'N/A'}
          </p>
          <div className="text-right">
            <p className="font-semibold">
              {project.members?.length || 0}
              <span className="font-normal"> members</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default BrowseProjects;

