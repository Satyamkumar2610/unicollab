export const EmptyState = ({ title = 'No items found', description = 'Try adjusting your filters or search terms' }) => (
  <div className="text-center py-12">
    <p className="text-gray-400 text-lg mb-2">{title}</p>
    <p className="text-gray-500">{description}</p>
  </div>
);
