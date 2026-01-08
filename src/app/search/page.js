"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CodeExplorer } from "@/components/CodeExplorer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SearchSidebar } from "@/components/search/SearchSidebar";
import { SearchNavbar } from "@/components/search/SearchNavbar";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBox } from "@/components/search/SearchBox";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { PopularSearches } from "@/components/search/PopularSearches";
import { SearchStats } from "@/components/search/SearchStats";
import { ViewToggle } from "@/components/search/ViewToggle";
import { useGitHubSearch } from "./hooks/useGitHubSearch";

export default function SearchPage() {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const { user } = useAuth();

  const {
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
  } = useGitHubSearch(user?.id);

  return (
    <SidebarProvider>
      <div
        className="flex h-full w-full bg-background gradient-mesh flex-col overflow-hidden"
        suppressHydrationWarning
      >
        <div className="flex flex-1 min-h-0 p-2 sm:p-4">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-xl sm:rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1 min-h-0">
            <SearchNavbar
              language={language}
              setLanguage={setLanguage}
              stars={stars}
              setStars={setStars}
              sort={sort}
              setSort={setSort}
              advancedFilters={advancedFilters}
              setAdvancedFilters={setAdvancedFilters}
            />
            <main className="flex-1 flex px-4 pb-4 overflow-y-auto min-h-0">
              {/* Main Search Canvas */}
              <div
                className={`flex-1 py-6 px-4 transition-all ${
                  selectedRepo ? "lg:w-1/2" : "w-full"
                }`}
              >
                <div className="max-w-6xl mx-auto">
                  <SearchHeader />

                  {/* Stats Banner */}
                  <SearchStats />

                  {searchResults.length === 0 && !loading && (
                    <PopularSearches
                      setSearchQuery={setSearchQuery}
                      handleSearch={handleSearch}
                    />
                  )}

                  <SearchBox
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    loading={loading}
                    handleSearch={handleSearch}
                    mode={mode}
                    setMode={setMode}
                  />

                  {/* View Toggle - Show when there are results */}
                  {searchResults.length > 0 && (
                    <div className="flex justify-end mb-4">
                      <ViewToggle view={view} setView={setView} />
                    </div>
                  )}

                  <SearchResults
                    loading={loading}
                    searchResults={searchResults}
                    setSelectedRepo={setSelectedRepo}
                    searchTime={searchTime}
                    totalCount={totalCount}
                    view={view}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                  />
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
  );
}
