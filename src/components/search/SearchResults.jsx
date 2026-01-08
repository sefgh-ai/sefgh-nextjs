"use client";

import { RepositoryCard } from "@/components/RepositoryCard";
import { LoadingState, CompactEmptyState } from "@/components/shared";

export function SearchResults({
  loading,
  searchResults,
  setSelectedRepo,
  searchTime,
  totalCount,
}) {
  if (loading) {
    return <LoadingState type="card" count={6} />;
  }

  if (searchResults.length === 0) {
    return (
      <div className="mx-auto">
        <CompactEmptyState
          icon="search"
          message="Enter a query above to search through millions of repositories"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {searchResults.length} of {totalCount.toLocaleString()}{" "}
        repositories
        {searchTime && <span className="ml-2">• Found in {searchTime}s</span>}
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
  );
}
