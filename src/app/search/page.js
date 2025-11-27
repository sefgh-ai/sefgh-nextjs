'use client'

import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { CodeExplorer } from "@/components/CodeExplorer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SearchSidebar } from "@/components/search/SearchSidebar"
import { SearchNavbar } from "@/components/search/SearchNavbar"
import { SearchHeader } from "@/components/search/SearchHeader"
import { SearchBox } from "@/components/search/SearchBox"
import { SearchFilters } from "@/components/search/SearchFilters"
import { SearchResults } from "@/components/search/SearchResults"
import { PopularSearches } from "@/components/search/PopularSearches"
import { ActivityLogger } from "@/lib/activity-logger"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("best-match")
  const [stars, setStars] = useState("")
  const { user } = useAuth()

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background gradient-mesh p-4 gap-4 flex-col" suppressHydrationWarning>
        <div className="flex gap-4 flex-1">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1">
          <SearchNavbar />
          <main className="flex-1 flex px-4 pb-4 overflow-auto">
            {/* Main Search Canvas */}
            <div className={`flex-1 py-6 px-4 transition-all ${selectedRepo ? 'lg:w-1/2' : 'w-full'}`}>
              <div className="max-w-6xl mx-auto">
                <SearchHeader />
                
                <SearchBox 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  loading={loading}
                  handleSearch={handleSearch}
                />
                
                <SearchFilters
                  language={language}
                  setLanguage={setLanguage}
                  stars={stars}
                  setStars={setStars}
                  sort={sort}
                  setSort={setSort}
                  handleClearFilters={handleClearFilters}
                />
                
                <SearchResults
                  loading={loading}
                  searchResults={searchResults}
                  setSelectedRepo={setSelectedRepo}
                />

                {searchResults.length === 0 && !loading && (
                  <PopularSearches 
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                  />
                )}
              </div>
            </div>

            {/* Code Explorer Canvas (Right Side) */}
            {selectedRepo && (
              <div className="hidden lg:block lg:w-1/2 border-l bg-card">
                <CodeExplorer
                  repository={selectedRepo}
                  onClose={() => setSelectedRepo(null)}
                />
              </div>
            )}

            {/* Mobile Code Explorer (Full Screen Overlay) */}
            {selectedRepo && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background">
                <CodeExplorer
                  repository={selectedRepo}
                  onClose={() => setSelectedRepo(null)}
                />
              </div>
            )}
          </main>
        </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
