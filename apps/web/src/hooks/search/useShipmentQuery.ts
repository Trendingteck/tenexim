import { useState, useCallback } from 'react';

export function useShipmentQuery() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<any>({});

  const updateFilters = useCallback((newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  return {
    query,
    setQuery,
    page,
    setPage,
    filters,
    updateFilters,
  };
}
