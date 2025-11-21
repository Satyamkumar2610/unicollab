export const LoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

export const SkeletonLoader = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-lg h-24 animate-pulse"></div>
    ))}
  </div>
);
