import { Button } from './Button';

export const Pagination = ({ metadata, onPageChange }) => {
  if (!metadata) return null;

  const { currentPage, totalPages } = metadata;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!metadata.hasPrevPage}
        variant="secondary"
      >
        Previous
      </Button>
      <span className="text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!metadata.hasNextPage}
        variant="secondary"
      >
        Next
      </Button>
    </div>
  );
};
