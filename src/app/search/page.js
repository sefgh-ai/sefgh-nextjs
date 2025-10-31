'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Home, Star, Clock, Bookmark, Settings, Filter, TrendingUp, Code, Users, Lock, MessageSquare } from "lucide-react"
import { Header } from "@/components/Header"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const { user } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query")
      return
    }
    
    // Add your search logic here
    toast.promise(
      // Simulate search API call
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Searching for "${searchQuery}"...`,
        success: "Search completed!",
        error: "Search failed",
      }
    )
    
    console.log("Searching for:", searchQuery)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background" suppressHydrationWarning>
        <Sidebar suppressHydrationWarning className="border-r">
          <SidebarContent className="gap-0">
            {/* Logo Section */}
            <div className="flex h-16 items-center border-b px-6">
              <a href="/" className="flex items-center gap-2 font-bold text-lg">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEFGH-AI
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
                    <SidebarMenuButton asChild className="hover:bg-accent">
                      <a href="/">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="bg-accent hover:bg-accent">
                      <a href="/search">
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-accent">
                      <a href="/chat">
                        <MessageSquare className="h-4 w-4" />
                        <span>AI Chat</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="hover:bg-accent">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trending</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="hover:bg-accent">
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
                      <SidebarMenuButton className="hover:bg-accent">
                        <Clock className="h-4 w-4" />
                        <span>History</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="hover:bg-accent">
                        <Bookmark className="h-4 w-4" />
                        <span>Bookmarks</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="hover:bg-accent">
                        <Star className="h-4 w-4" />
                        <span>Favorites</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="hover:bg-accent">
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
                    Sign in to access your history, bookmarks, and personalized features.
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col" suppressHydrationWarning>
          <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger className="hover:bg-accent" />
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Header />
              </div>
            </div>
          </div>
          <main className="flex-1 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Search with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find exactly what you need across millions of repositories
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repositories, code, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button type="submit" size="lg" className="flex-1">
                Search Repositories
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1">
                Search Code
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1">
                Search Users
              </Button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Language: All</Button>
            <Button variant="outline" size="sm">Stars: Any</Button>
            <Button variant="outline" size="sm">License: Any</Button>
            <Button variant="outline" size="sm">Updated: Anytime</Button>
            <Button variant="outline" size="sm">Sort: Best Match</Button>
          </div>
        </div>

        {/* Results Section */}
        {searchResults.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-20 border rounded-lg bg-card">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
              <p className="text-muted-foreground">
                Enter a query above to search through millions of repositories
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Search results will be displayed here */}
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                <p className="text-muted-foreground mb-4">{result.description}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>⭐ {result.stars}</span>
                  <span>🔗 {result.language}</span>
                  <span>📅 Updated {result.updated}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-start">
              <span className="font-semibold mb-1">React Projects</span>
              <span className="text-sm text-muted-foreground">Frontend frameworks</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-start">
              <span className="font-semibold mb-1">Machine Learning</span>
              <span className="text-sm text-muted-foreground">AI & ML repositories</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-start">
              <span className="font-semibold mb-1">Web3 & Blockchain</span>
              <span className="text-sm text-muted-foreground">Decentralized apps</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
