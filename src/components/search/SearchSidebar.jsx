"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Home,
  Search,
  MessageSquare,
  TrendingUp,
  Star,
  Code,
  Users,
  Filter,
  Clock,
  Settings,
  Lock,
  Upload,
  Key,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SearchSidebar({ user }) {
  const pathname = usePathname();
  const { openSettings } = useSettings();
  return (
    <Sidebar
      suppressHydrationWarning
      className="glass-premium border-r-0 shadow-premium overflow-hidden group-data-[state=collapsed]:m-0 m-4 rounded-2xl max-h-[calc(100vh-2rem)] group-data-[state=collapsed]:h-screen group-data-[state=collapsed]:rounded-none"
      style={{ "--sidebar-width": "14rem" }}
    >
      <SidebarContent className="gap-0 overflow-auto">
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b border-white/5 px-6 backdrop-blur-xl rounded-t-2xl">
          <a
            href="/home"
            className="flex items-center gap-2 font-bold text-lg transition-smooth hover:scale-105"
          >
            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-slate-400 bg-clip-text text-transparent">
              SEFGH
            </span>
          </a>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-xl transition-smooth ${
                    pathname === "/home"
                      ? "bg-gradient-to-r from-blue-500/20 to-slate-500/20 glow-border-blue"
                      : "hover:bg-white/10 hover:shadow-soft"
                  }`}
                >
                  <a href="/home">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-xl transition-smooth ${
                    pathname === "/search"
                      ? "bg-gradient-to-r from-blue-500/20 to-slate-500/20 glow-border-blue"
                      : "hover:bg-white/10 hover:shadow-soft"
                  }`}
                >
                  <a href="/search">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-xl transition-smooth ${
                    pathname === "/chat"
                      ? "bg-gradient-to-r from-blue-500/20 to-slate-500/20 glow-border-blue"
                      : "hover:bg-white/10 hover:shadow-soft"
                  }`}
                >
                  <a href="/chat">
                    <MessageSquare className="h-4 w-4" />
                    <span>AI Chat</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-xl transition-smooth ${
                    pathname === "/trending"
                      ? "bg-gradient-to-r from-blue-500/20 to-slate-500/20 glow-border-blue"
                      : "hover:bg-white/10 hover:glow-border-slate"
                  }`}
                >
                  <a href="/trending">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="rounded-xl hover:bg-white/10 hover:glow-border-cyan transition-smooth">
                  <Star className="h-4 w-4" />
                  <span>Starred</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-accent">
                  <Code className="h-4 w-4" />
                  <span>Repositories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-accent">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-accent">
                  <Filter className="h-4 w-4" />
                  <span>Topics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user ? (
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Your Content
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`rounded-xl transition-smooth ${
                      pathname === "/playground"
                        ? "bg-gradient-to-r from-blue-500/20 to-slate-500/20 glow-border-blue"
                        : "hover:bg-accent"
                    }`}
                  >
                    <a href="/playground">
                      <Key className="h-4 w-4" />
                      <span>Playground</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`rounded-xl transition-smooth ${
                      pathname === "/submissions"
                        ? "bg-gradient-to-r from-blue-500/20 to-slate-500/20 glow-border-blue"
                        : "hover:bg-accent"
                    }`}
                  >
                    <a href="/submissions">
                      <Upload className="h-4 w-4" />
                      <span>Submissions</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-accent">
                    <Clock className="h-4 w-4" />
                    <span>History</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={openSettings}
                    className="hover:bg-accent cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Get Started
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-accent">
                    <a href="/login">
                      <Lock className="h-4 w-4" />
                      <span>Login to Access</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Sign in to access your history, bookmarks, and personalized
                features.
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
