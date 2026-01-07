"use client";

import { Button } from "@/components/ui/button";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SubmitProjectDialog } from "@/components/SubmitProjectDialog";
import { Clock, TrendingUp, Flame } from "lucide-react";

const TABS = [
  { id: "latest", label: "Latest", icon: Clock },
  { id: "monthly", label: "Monthly", icon: TrendingUp },
  { id: "yearly", label: "Yearly", icon: Flame },
];

export function SearchNavbar({ selectedTab, onTabChange }) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 gap-3">
        <SidebarTrigger className="hover:bg-white/10 rounded-xl transition-smooth" />

        {/* Filter Tabs */}
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={selectedTab === tab.id ? "default" : "ghost"}
                size="sm"
                className={`h-8 ${
                  selectedTab === tab.id
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => onTabChange?.(tab.id)}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            Featured
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            All
          </Button>
        </div>

        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <SubmitProjectDialog>
            <Button
              variant="outline"
              className="glass-premium border border-white/10 rounded-xl hover:glow-border-blue transition-smooth shadow-soft hover:shadow-soft-lg"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </SubmitProjectDialog>
          <Header showProfileDropdown={false} />
        </div>
      </div>
    </div>
  );
}
