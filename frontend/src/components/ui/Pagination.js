export const Pagination = ({ metadata, onPageChange }) => {
  if (!metadata) return null;

  const { currentPage, totalPages } = metadata;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!metadata.hasPrevPage}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
      >
        Previous
      </button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!metadata.hasNextPage}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
      >
        Next
      </button>
    </div>
  );
};
