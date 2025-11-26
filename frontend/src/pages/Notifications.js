import { useState } from 'react';
import { api } from '../services/api';
import { useList } from '../hooks/useList';
import { usePagination } from '../hooks/usePagination';
import { SkeletonLoader } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { buildListUrl } from '../utils/queryBuilder';

export const Notifications = () => {
  const { page, limit, goToPage, resetPage } = usePagination();
  const [filter, setFilter] = useState('all');

  const { data, metadata, loading, error, refetch } = useList(
    () => api.get(buildListUrl('/notifications', { page, limit, read: filter === 'unread' ? false : undefined })),
    [page, limit, filter]
  );

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      refetch();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      refetch();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  if (loading) return <SkeletonLoader count={5} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Notifications</h1>
          {data.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition text-white"
            >
              Mark All as Read
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          {['all', 'unread'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); resetPage(); }}
              className={`px-4 py-2 rounded-lg transition ${filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {data.length === 0 ? (
          <EmptyState title="No notifications" />
        ) : (
          <div className="space-y-4">
            {data.map(notif => (
              <div
                key={notif._id}
                className={`bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border ${notif.read ? 'border-gray-700' : 'border-purple-500'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{notif.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="ml-4 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition text-white"
                    >
                      Mark Read
                    </button>
                  )}
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
