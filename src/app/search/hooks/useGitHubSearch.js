import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("all");
  const [stars, setStars] = useState("");
  const [mode, setMode] = useState("scout");
  const [view, setView] = useState("grid");
  const [searchTime, setSearchTime] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedFilters, setAdvancedFilters] = useState({
    license: "",
    dateRange: "",
    hasWiki: false,
    hasIssues: false,
    topics: [],
    forks: "",
  });

  const handleSearch = useCallback(
    async (e, queryOverride = null) => {
      e?.preventDefault();

      const query = queryOverride || searchQuery;
      if (!query.trim()) {
        toast.error("Please enter a search query");
        return;
      }

      setLoading(true);
      const startTime = performance.now();
      try {
        const params = new URLSearchParams({
          q: query,
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
          ActivityLogger.search(query);

          // Save to search history in database (if user is authenticated)
          if (userId) {
            saveSearchHistory(userId, query.trim(), "search", {
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
          searchQuery: query,
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

  // Auto-search when there's an initial query from URL params
  useEffect(() => {
    if (initialQuery && !hasAutoSearched) {
      setHasAutoSearched(true);
      handleSearch();
    }
  }, [initialQuery, hasAutoSearched, handleSearch]);

  const handleClearFilters = useCallback(() => {
    setLanguage("");
    setSort("all");
    setStars("");
    setAdvancedFilters({
      license: "",
      dateRange: "",
      hasWiki: false,
      hasIssues: false,
      topics: [],
      forks: "",
    });
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !searchQuery.trim()) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        sort: sort,
        page: nextPage.toString(),
        per_page: "30",
      });

      if (language) params.append("language", language);
      if (stars) params.append("stars", stars);

      const response = await fetch(`/api/github/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults((prev) => [...prev, ...(data.items || [])]);
        setCurrentPage(nextPage);
      } else {
        throw new Error(data.error || "Failed to load more");
      }
    } catch (error) {
      console.error("Load more error:", error);
      toast.error("Failed to load more results");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, searchQuery, sort, language, stars, currentPage]);

  const hasMore = searchResults.length < totalCount;

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    loadingMore,
    language,
    setLanguage,
    sort,
    setSort,
    stars,
    setStars,
    mode,
    setMode,
    view,
    setView,
    advancedFilters,
    setAdvancedFilters,
    handleSearch,
    handleClearFilters,
    handleLoadMore,
    hasMore,
    searchTime,
    totalCount,
  };
}
