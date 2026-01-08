import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ActivityLogger } from "@/lib/activity-logger";
import { logError } from "@/lib/error-tracking";
import { saveSearchHistory } from "@/lib/supabase/search-history";

/**
 * Custom hook for GitHub repository search with history tracking
 * @param {string} userId - User ID for saving search history to database
 * @returns {Object} result
 * @returns {string} result.searchQuery - Current search query string
 * @returns {Function} result.setSearchQuery - Set search query
 * @returns {Array} result.searchResults - Array of GitHub repository results
 * @returns {boolean} result.loading - Loading state indicator
 * @returns {string} result.language - Selected language filter
 * @returns {Function} result.setLanguage - Set language filter
 * @returns {string} result.sort - Current sort option
 * @returns {Function} result.setSort - Set sort option
 * @returns {string} result.stars - Star count filter
 * @returns {Function} result.setStars - Set stars filter
 * @returns {Function} result.handleSearch - Execute search (async)
 * @returns {Function} result.handleClearFilters - Clear all filters
 */
export function useGitHubSearch(userId) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("all");
  const [stars, setStars] = useState("");
  const [searchTime, setSearchTime] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = useCallback(
    async (e) => {
      e?.preventDefault();

      if (!searchQuery.trim()) {
        toast.error("Please enter a search query");
        return;
      }

      setLoading(true);
      const startTime = performance.now();
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          sort: sort,
        });

        if (language) params.append("language", language);
        if (stars) params.append("stars", stars);

        const response = await fetch(`/api/github/search?${params}`);
        const data = await response.json();
        const endTime = performance.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

        if (response.ok) {
          setSearchResults(data.items || []);
          setTotalCount(data.total_count || 0);
          setSearchTime(timeTaken);
          toast.success(`Found ${data.total_count} repositories`);

          // Log search activity
          ActivityLogger.search(searchQuery);

          // Save to search history in database (if user is authenticated)
          if (userId) {
            saveSearchHistory(userId, searchQuery.trim(), "search", {
              filters: { language, sort, stars },
              resultsCount: data.total_count || 0,
            });
          }
        } else {
          throw new Error(data.error || "Search failed");
        }
      } catch (error) {
        console.error("Search error:", error);
        logError("search_failed", error, {
          searchQuery,
          language,
          sort,
          stars,
        });
        toast.error(error.message || "Failed to search repositories");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, sort, language, stars, userId]
  );

  const handleClearFilters = useCallback(() => {
    setLanguage("");
    setSort("all");
    setStars("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    language,
    setLanguage,
    sort,
    setSort,
    stars,
    setStars,
    handleSearch,
    handleClearFilters,
    searchTime,
    totalCount,
  };
}
