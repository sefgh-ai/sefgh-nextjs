"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SearchNavbar } from "@/components/search/SearchNavbar";
import { SearchSidebar } from "@/components/search/SearchSidebar";
import { PreferencesDialog } from "@/components/PreferencesDialog";
import OnboardingBanner from "@/components/OnboardingBanner";
import {
  CategoriesSidebar,
  ProjectsFeed,
  UserProfileCard,
  AboutCard,
} from "@/components/home";
import { mockProjects } from "@/data/mockProjects";

// Helper to get initial preferences from localStorage
function getInitialPreferences() {
  if (typeof window === "undefined") return { tags: [], mode: "OR" };
  try {
    const saved = localStorage.getItem("projectPreferences");
    return saved ? JSON.parse(saved) : { tags: [], mode: "OR" };
  } catch {
    return { tags: [], mode: "OR" };
  }
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();

  // Initialize with mock data immediately - no loading delay for better UX
  const [allProjects, setAllProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false); // Start as false - we have data!
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTab, setSelectedTab] = useState("latest");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState(getInitialPreferences);

  // Create Supabase client
  const supabase = useMemo(() => createClient(), []);

  // Derive filtered projects from state (no effect needed)
  const projects = useMemo(() => {
    let filtered = [...allProjects];

    // Filter by selected category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((project) => {
        return (
          project.category === selectedCategory ||
          project.tags?.some((tag) => tag === selectedCategory)
        );
      });
    }

    // Apply preference filtering if preferences are set
    if (userPreferences.tags.length > 0) {
      const preferenceTagNames = userPreferences.tags.map((t) => t.name);

      if (userPreferences.mode === "OR") {
        filtered = filtered.filter((project) => {
          return (
            preferenceTagNames.includes(project.category) ||
            project.tags?.some((tag) => preferenceTagNames.includes(tag)) ||
            preferenceTagNames.includes(project.language)
          );
        });
      } else {
        filtered = filtered.filter((project) => {
          const projectTags = [
            project.category,
            ...(project.tags || []),
            project.language,
          ].filter(Boolean);

          return preferenceTagNames.every((prefTag) =>
            projectTags.includes(prefTag)
          );
        });
      }
    }

    return filtered;
  }, [allProjects, selectedCategory, userPreferences]);

  // Fetch projects from Supabase in background (doesn't block UI)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        // Only update if we got real data from database
        if (!error && data && data.length > 0) {
          setAllProjects(data);
        }
        // Otherwise keep using mockProjects (already set as initial state)
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [supabase, selectedTab]);

  const handlePreferencesSave = useCallback((preferences) => {
    setUserPreferences(preferences);
    setSelectedCategory("All");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory("All");
    setUserPreferences({ tags: [], mode: "OR" });
    localStorage.removeItem("projectPreferences");
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background gradient-mesh p-4 gap-4 flex-col">
        <div className="flex gap-4 flex-1">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1">
            <SearchNavbar />

            <div className="container mx-auto px-4 py-6 pb-4 overflow-auto flex-1">
              <OnboardingBanner />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar - Categories */}
                <aside className="lg:col-span-2 space-y-4">
                  <CategoriesSidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    userPreferences={userPreferences}
                    onOpenPreferences={() => setPreferencesOpen(true)}
                  />
                </aside>

                {/* Main Content - Feed */}
                <ProjectsFeed
                  projects={projects}
                  loading={loading}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  userPreferences={userPreferences}
                  onClearFilters={handleClearFilters}
                />

                {/* Right Sidebar - User Info */}
                <aside className="lg:col-span-3 space-y-4">
                  <UserProfileCard user={user} loading={authLoading} />
                  <AboutCard />
                </aside>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>

      <PreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        onSave={handlePreferencesSave}
      />
    </SidebarProvider>
  );
}
