import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useList } from '../hooks/useList';
import { usePagination } from '../hooks/usePagination';
import { LoadingState, SkeletonLoader } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { ListFilters } from '../components/ListFilters';
import { buildListUrl } from '../utils/queryBuilder';

export const Explore = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { page, limit, goToPage, resetPage } = usePagination();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  const { data, metadata, loading, error, refetch } = useList(
    () => api.get(buildListUrl('/projects', { page, limit, search, sortBy, order: 'desc', status, category })),
    [page, limit, search, sortBy, status, category]
  );

  const handleSearch = (value) => {
    setSearch(value);
    resetPage();
  };

  const handleSort = (value) => {
    setSortBy(value);
    resetPage();
  };

  const handleFilter = (key, value) => {
    if (key === 'status') setStatus(value);
    if (key === 'category') setCategory(value);
    resetPage();
  };

  const handleJoinProject = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/join`);
      refetch();
    } catch (err) {
      console.error('Error joining project:', err);
    }
  };

  if (loading) return <SkeletonLoader count={6} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Explore Projects</h1>

        <ListFilters
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          filters={{ status: true, category: true }}
        />

        {data.length === 0 ? (
          <EmptyState title="No projects found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(project => (
              <div
                key={project._id}
                className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition cursor-pointer"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded">
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-400">{project.members.length} members</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinProject(project._id);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
                >
                  Join Project
                </button>
              </div>
            ))}
          </div>
        )}

        {metadata && <Pagination metadata={metadata} onPageChange={goToPage} />}
      </div>
    </div>
  );
};
