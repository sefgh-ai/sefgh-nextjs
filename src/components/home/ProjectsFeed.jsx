"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Clock, TrendingUp, Flame } from "lucide-react";
import { ProjectCard, ProjectCardSkeleton } from "./ProjectCard";

const TABS = [
  { id: "latest", label: "Latest", icon: Clock },
  { id: "monthly", label: "Monthly", icon: TrendingUp },
  { id: "yearly", label: "Yearly", icon: Flame },
];

export function ProjectsFeed({
  projects,
  loading,
  selectedTab,
  onTabChange,
  userPreferences,
  onClearFilters,
}) {
  return (
    <main className="lg:col-span-7 space-y-4">
      {/* Tabs */}
      <Card className="glass-premium border-border backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={selectedTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  className={
                    selectedTab === tab.id
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
            <div className="ml-auto flex gap-2 items-center">
              {userPreferences?.tags?.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {userPreferences.mode} Filter Active
                </Badge>
              )}
              <Button variant="outline" size="sm" className="hover:bg-accent">
                Featured
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-accent">
                All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Feed */}
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 pr-4">
          {loading ? (
            // Loading skeleton - show only 3 for faster perceived load
            Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))
          ) : projects.length === 0 ? (
            // No results
            <Card className="glass-premium border-border backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Code className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
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
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </ScrollArea>
    </main>
  );
}
