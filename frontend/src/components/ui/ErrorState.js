export const ErrorState = ({ error, onRetry }) => (
  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
    <p className="text-red-400 mb-4">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
      >
        Try Again
      </button>
    )}
  </div>
);
