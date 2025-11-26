import { useState, useEffect } from 'react';

export const useList = (fetchFn, dependencies = []) => {
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFn();
        setData(response.data);
        setMetadata(response.metadata);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, dependencies);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      setData(response.data);
      setMetadata(response.metadata);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return { data, metadata, loading, error, refetch };
};
