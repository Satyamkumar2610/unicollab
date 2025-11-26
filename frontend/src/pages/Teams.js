import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useList } from '../hooks/useList';
import { usePagination } from '../hooks/usePagination';
import { SkeletonLoader } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { ListFilters } from '../components/shared/ListFilters';
import { buildListUrl } from '../utils/queryBuilder';

export const Teams = () => {
  const navigate = useNavigate();
  const { page, limit, goToPage, resetPage } = usePagination();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', university: '', major: '' });

  const { data, metadata, loading, error, refetch } = useList(
    () => api.get(buildListUrl('/teams', { page, limit, search, sortBy, order: 'desc' })),
    [page, limit, search, sortBy]
  );

  const handleSearch = (value) => {
    setSearch(value);
    resetPage();
  };

  const handleSort = (value) => {
    setSortBy(value);
    resetPage();
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams', formData);
      setFormData({ name: '', description: '', university: '', major: '' });
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  if (loading) return <SkeletonLoader count={6} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Teams</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition text-white"
          >
            {showCreateForm ? 'Cancel' : 'Create Team'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateTeam} className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 mb-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Team Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="University"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button type="submit" className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
              Create Team
            </button>
          </form>
        )}

        <ListFilters
          onSearch={handleSearch}
          onSort={handleSort}
          filters={{}}
        />

        {data.length === 0 ? (
          <EmptyState title="No teams found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(team => (
              <div
                key={team._id}
                className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition cursor-pointer"
                onClick={() => navigate(`/teams/${team._id}`)}
              >
                <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{team.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{team.members.length} members</span>
                  <span className="text-xs text-purple-400">{team.university}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {metadata && <Pagination metadata={metadata} onPageChange={goToPage} />}
      </div>
    </div>
  );
};
