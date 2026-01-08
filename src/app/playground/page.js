"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SearchNavbar } from "@/components/search/SearchNavbar";
import { SearchSidebar } from "@/components/search/SearchSidebar";
import { MobileBottomNav } from "@/components/search/MobileBottomNav";
import Footer from "@/components/Footer";
import PlaygroundHeader from "./components/PlaygroundHeader";
import { playgroundTabs } from "./utils/tabConfig";

export default function PlaygroundPage() {
  const { user } = useAuth() || {};
  const { isAuthenticated, isLoading } = useAuthGuard();
  const [activeTab, setActiveTab] = useState("keys");

  if (isLoading || !user) {
    return <PageLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-full w-full bg-background gradient-mesh flex-col overflow-hidden">
        {/* Main content area with sidebar */}
        <div className="flex flex-1 min-h-0 p-1 sm:p-4 gap-1 sm:gap-4 pb-[72px] md:pb-2">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-lg sm:rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1 min-h-0">
            <SearchNavbar showFilters={false} />

            <div className="w-full px-2 sm:px-6 lg:px-8 py-2 sm:py-6 pb-4 overflow-y-auto flex-1 min-h-0">
              <div className="container mx-auto max-w-7xl">
                <PlaygroundHeader />

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                    {playgroundTabs.map(({ value, label, icon: Icon }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {playgroundTabs.map(({ value, component: Component }) => (
                    <TabsContent
                      key={value}
                      value={value}
                      className="space-y-4"
                    >
                      <Component userId={user.id} />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </SidebarInset>
        </div>

        {/* Footer - hidden on mobile to make room for bottom nav */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav user={user} />
      </div>
    </SidebarProvider>
  );
}
