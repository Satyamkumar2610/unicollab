export const ListFilters = ({ onSearch, onSort, onFilter, filters = {} }) => (
  <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 mb-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
      />
      
      <select
        onChange={(e) => onSort(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
      >
        <option value="createdAt">Newest</option>
        <option value="title">Title</option>
        <option value="updatedAt">Recently Updated</option>
      </select>

      {filters.status && (
        <select
          onChange={(e) => onFilter('status', e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      )}

      {filters.category && (
        <select
          onChange={(e) => onFilter('category', e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">All Categories</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="ai">AI/ML</option>
          <option value="other">Other</option>
        </select>
      )}
    </div>
  </div>
);
