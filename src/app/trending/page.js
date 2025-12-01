"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SearchNavbar } from "@/components/search/SearchNavbar";
import { SearchSidebar } from "@/components/search/SearchSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingFilters } from "./components/TrendingFilters";
import { TrendingRepositoryCard } from "./components/TrendingRepositoryCard";
import { TrendingDeveloperCard } from "./components/TrendingDeveloperCard";
import { useTrendingData } from "./hooks/useTrendingData";
import {
  SPOKEN_LANGUAGES,
  SORT_OPTIONS,
  sortRepositories,
  getHeatIndicator,
} from "./utils/trendingHelpers";

export default function TrendingPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Filter state
  const [activeTab, setActiveTab] = useState("repositories");
  const [spokenLanguage, setSpokenLanguage] = useState("english");
  const [programmingLanguage, setProgrammingLanguage] = useState("any");
  const [dateRange, setDateRange] = useState("daily");
  const [sortBy, setSortBy] = useState("stars");

  // Programming languages state
  const [programmingLanguages, setProgrammingLanguages] = useState([]);

  // Custom hook for data fetching
  const {
    loading,
    repositories,
    developers,
    isRefreshing,
    lastRefresh,
    isDataStale,
    handleRefreshTrending,
    getCustomTrendingRepos,
  } = useTrendingData(activeTab, programmingLanguage, spokenLanguage, dateRange);

  // Fetch programming languages list
  useEffect(() => {
    const fetchProgrammingLanguages = async () => {
      try {
        const response = await fetch("/api/github/languages");
        if (response.ok) {
          const data = await response.json();
          setProgrammingLanguages(["any", ...data]);
        } else {
          // Fallback to common languages
          setProgrammingLanguages([
            "any",
            "javascript",
            "python",
            "java",
            "typescript",
            "go",
            "rust",
            "c++",
            "c#",
            "php",
            "ruby",
            "swift",
            "kotlin",
          ]);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
        setProgrammingLanguages([
          "any",
          "javascript",
          "python",
          "java",
          "typescript",
        ]);
      }
    };

    fetchProgrammingLanguages();
  }, []);

  // Merge and sort repositories
  const customRepos = getCustomTrendingRepos();
  const allRepos = [...customRepos, ...repositories];
  const displayRepos = sortRepositories(allRepos, sortBy);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background gradient-mesh p-4 gap-4 flex-col">
        <div className="flex gap-4 flex-1">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1">
            <SearchNavbar />

            <main className="flex-1 py-6 px-4 pb-4 overflow-auto">
              <div className="max-w-7xl mx-auto px-4">
                {/* Filters */}
                <TrendingFilters
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  spokenLanguage={spokenLanguage}
                  setSpokenLanguage={setSpokenLanguage}
                  programmingLanguage={programmingLanguage}
                  setProgrammingLanguage={setProgrammingLanguage}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  spokenLanguages={SPOKEN_LANGUAGES}
                  programmingLanguages={programmingLanguages}
                  sortOptions={SORT_OPTIONS}
                  lastRefresh={lastRefresh}
                  isDataStale={isDataStale}
                  isRefreshing={isRefreshing}
                  handleRefreshTrending={handleRefreshTrending}
                />

                {/* Content */}
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-4 pr-4">
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: 5 }).map((_, i) => (
                        <Card
                          key={i}
                          className="bg-slate-900/50 border-slate-800 backdrop-blur-sm animate-pulse"
                        >
                          <CardContent className="p-6">
                            <div className="h-6 bg-slate-800 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
                            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                          </CardContent>
                        </Card>
                      ))
                    ) : activeTab === "repositories" ? (
                      // Repositories List
                      displayRepos.map((repo, index) => (
                        <TrendingRepositoryCard
                          key={repo.id}
                          repo={repo}
                          index={index}
                          onNavigate={(path) => router.push(path)}
                          getHeatIndicator={getHeatIndicator}
                        />
                      ))
                    ) : (
                      // Developers List
                      developers.map((dev) => (
                        <TrendingDeveloperCard
                          key={dev.id}
                          dev={dev}
                          onNavigate={(path) => router.push(path)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
