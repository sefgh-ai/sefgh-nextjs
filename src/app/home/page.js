"use client";

import { useState, useCallback } from "react";
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
import { useProjects } from "./hooks/useProjects";
import { useFilteredProjects } from "./hooks/useFilteredProjects";
import { getInitialPreferences, clearSavedPreferences } from "./utils/preferencesHelper";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTab, setSelectedTab] = useState("latest");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState(getInitialPreferences);

  const { allProjects, loading } = useProjects(selectedTab);
  const projects = useFilteredProjects(allProjects, selectedCategory, userPreferences);

  const handlePreferencesSave = useCallback((preferences) => {
    setUserPreferences(preferences);
    setSelectedCategory("All");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory("All");
    setUserPreferences({ tags: [], mode: "OR" });
    clearSavedPreferences();
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
