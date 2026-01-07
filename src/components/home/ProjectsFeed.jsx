"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Code, Filter, X, Settings, Loader2 } from "lucide-react";
import { ProjectCard, ProjectCardSkeleton } from "./ProjectCard";
import { useCategories } from "@/hooks/home/useCategories";

export function ProjectsFeed({
  projects,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  userPreferences,
  onClearFilters,
  selectedCategory,
  onCategoryChange,
  onOpenPreferences,
}) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const { categories: liveCategories } = useCategories();
  const scrollRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore?.();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  // Filter out "All" from live categories to avoid duplication
  const filteredLiveCategories = liveCategories.filter(
    (cat) => cat.name !== "All"
  );
  const categories = [{ name: "All", icon: "🎯" }, ...filteredLiveCategories];

  return (
    <main className="col-span-1 lg:col-span-7 flex flex-col h-[calc(100vh-180px)] min-h-0">
      {/* Mobile Category Filter Bar */}
      <div className="lg:hidden shrink-0 mb-3">
        <Card className="glass-premium border-border backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {selectedCategory !== "All" && (
                      <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5">
                        1
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      <span>Filter Projects</span>
                      {selectedCategory !== "All" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onCategoryChange("All");
                            onClearFilters();
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Clear
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Categories</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id || category.name}
                            variant={
                              selectedCategory === category.name
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="justify-start"
                            onClick={() => {
                              onCategoryChange(category.name);
                              setFilterSheetOpen(false);
                            }}
                          >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onOpenPreferences();
                        setFilterSheetOpen(false);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced Preferences
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Horizontal scrollable category pills for mobile */}
              <ScrollArea className="flex-1 whitespace-nowrap">
                <div className="flex gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <Button
                      key={category.id || category.name}
                      variant={
                        selectedCategory === category.name ? "default" : "ghost"
                      }
                      size="sm"
                      className={`shrink-0 ${
                        selectedCategory === category.name
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => onCategoryChange(category.name)}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="invisible" />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Feed - native scroll for cleaner appearance */}
      <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollRef}>
        <div className="space-y-4 pr-2">
          {loading ? (
            // Loading skeleton - show only 3 for faster perceived load
            Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))
          ) : projects.length === 0 ? (
            // No results
            <Card className="glass-premium border-border backdrop-blur-sm">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Code className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      No projects found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Try adjusting your filters or preferences
                    </p>
                    <Button variant="outline" onClick={onClearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}

              {/* Infinite scroll trigger & Load More button */}
              <div ref={loadMoreRef} className="py-4 flex justify-center">
                {loadingMore ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                ) : hasMore ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoadMore}
                    className="glass-premium"
                  >
                    Load More
                  </Button>
                ) : projects.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No more projects to load
                  </p>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
