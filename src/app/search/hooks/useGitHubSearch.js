import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { ActivityLogger } from "@/lib/activity-logger"
import { logError } from "@/lib/error-tracking"

/**
 * Save search query to history
 */
function saveToSearchHistory(query) {
  if (typeof window === "undefined") return
  
  try {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const updated = [query, ...history.filter(q => q !== query)].slice(0, 10)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

/**
 * Get search history from localStorage
 */
function getSearchHistory() {
  if (typeof window === "undefined") return []
  
  try {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]')
  } catch (error) {
    return []
  }
}

/**
 * Custom hook for GitHub repository search with history tracking
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
 * @returns {Array} result.searchHistory - Recent search queries (max 10)
 */
export function useGitHubSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("best-match")
  const [stars, setStars] = useState("")
  const [searchHistory, setSearchHistory] = useState([])

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault()
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        sort: sort,
      })
      
      if (language) params.append('language', language)
      if (stars) params.append('stars', stars)

      const response = await fetch(`/api/github/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data.items || [])
        toast.success(`Found ${data.total_count} repositories`)
        
        // Log search activity
        ActivityLogger.search(searchQuery)
        
        // Save to search history
        saveToSearchHistory(searchQuery.trim())
        setSearchHistory(getSearchHistory())
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
      logError('search_failed', error, { searchQuery, language, sort, stars })
      toast.error(error.message || "Failed to search repositories")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, sort, language, stars])

  const handleClearFilters = useCallback(() => {
    setLanguage("")
    setSort("best-match")
    setStars("")
  }, [])

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
    searchHistory
  }
}
