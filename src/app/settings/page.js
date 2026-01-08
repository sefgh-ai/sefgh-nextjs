"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  Monitor,
  Palette,
  Database,
  MessageSquare,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner";
import AccountTab from "@/components/settings/AccountTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import SecurityTab from "@/components/settings/SecurityTab";
import SessionsTab from "@/components/settings/SessionsTab";
import PersonalizeTab from "@/components/settings/PersonalizeTab";
import DataControlsTab from "@/components/settings/DataControlsTab";
import FeedbackTab from "@/components/settings/FeedbackTab";

const settingsTabs = [
  {
    id: "account",
    label: "Account",
    icon: User,
    description: "Manage your profile & preferences",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Control how we reach you",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Protect your account",
  },
  {
    id: "sessions",
    label: "Sessions",
    icon: Monitor,
    description: "View active sessions",
  },
  {
    id: "personalize",
    label: "Personalize",
    icon: Palette,
    description: "Customize your experience",
  },
  {
    id: "data",
    label: "Data & Privacy",
    icon: Database,
    description: "Manage your data",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    description: "Help us improve",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isAuthenticated, isLoading } = useAuthGuard();

  // Get initial tab from URL or default to 'account'
  const tabFromUrl = searchParams.get("tab");
  const initialTab =
    tabFromUrl && settingsTabs.find((t) => t.id === tabFromUrl)
      ? tabFromUrl
      : "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/settings?tab=${tabId}`, { scroll: false });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        // Already on settings page
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab />;
      case "notifications":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      case "sessions":
        return <SessionsTab />;
      case "personalize":
        return <PersonalizeTab />;
      case "data":
        return <DataControlsTab />;
      case "feedback":
        return <FeedbackTab />;
      default:
        return <AccountTab />;
    }
  };

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentTab = settingsTabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex-1" />
          <Header />
        </div>
      </div>

      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Back Button & Page Title */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your SEFGH account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-72 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full group flex items-start gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 border border-primary/20 shadow-sm"
                        : "hover:bg-muted/60 border border-transparent"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted/50 text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-sm font-medium truncate transition-colors ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate mt-0.5">
                        {tab.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
              {/* Tab Header */}
              <div className="px-8 py-6 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  {currentTab && (
                    <>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <currentTab.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {currentTab.label}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {currentTab.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-8 py-8">{renderTabContent()}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
