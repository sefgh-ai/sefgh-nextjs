import { useState, useCallback } from "react";

/**
 * Generic hook for managing filter state
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filter state and setters
 */
export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const resetFilter = useCallback(
    (key) => {
      setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
    },
    [initialFilters]
  );

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    resetFilter,
    setFilters,
  };
}
