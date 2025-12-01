import { useState } from "react"
import { toast } from "sonner"
import { ActivityLogger } from "@/lib/activity-logger"

/**
 * Custom hook for GitHub repository search
 * @returns {Object} Search state and handlers
 */
export function useGitHubSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("best-match")
  const [stars, setStars] = useState("")

  const handleSearch = async (e) => {
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
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error(error.message || "Failed to search repositories")
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setLanguage("")
    setSort("best-match")
    setStars("")
  }

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
    handleClearFilters
  }
}
