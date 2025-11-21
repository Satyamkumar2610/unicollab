import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((newPage) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage(p => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return { page, limit, setLimit, goToPage, nextPage, prevPage, resetPage };
};
