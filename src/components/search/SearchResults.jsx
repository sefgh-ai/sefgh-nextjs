'use client'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { RepositoryCard } from "@/components/RepositoryCard"

export function SearchResults({ loading, searchResults, setSelectedRepo }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 rounded-xl border bg-card animate-pulse">
            <div className="h-6 bg-muted rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-4 w-5/6"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (searchResults.length === 0) {
    return (
      <div className="mx-auto">
        <div className="text-center py-20 border rounded-lg bg-card">
          <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
          <p className="text-muted-foreground">
            Enter a query above to search through millions of repositories
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {searchResults.length} repositories
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchResults.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repo={repo}
            onSelect={setSelectedRepo}
          />
        ))}
      </div>
    </>
  )
}
