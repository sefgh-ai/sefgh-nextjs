'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SearchNavbar } from '@/components/search/SearchNavbar';
import { SearchSidebar } from '@/components/search/SearchSidebar';
import { PreferencesDialog } from '@/components/PreferencesDialog';
import OnboardingBanner from '@/components/OnboardingBanner';
import {
  Eye,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Clock,
  Flame,
  Users,
  Code,
  BookOpen,
  Activity,
  Settings,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // Store all projects
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTab, setSelectedTab] = useState('latest');
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState({ tags: [], mode: 'OR' });
  const supabase = createClient();

  // Default categories (used if no preferences set)
  const defaultCategories = [
    { name: 'All', icon: '🎯' },
    { name: 'Python', icon: '🐍' },
    { name: 'Java', icon: '☕' },
    { name: 'C++', icon: '⚙️' },
    { name: 'JavaScript', icon: '⚡' },
    { name: 'Tutorial', icon: '📚' },
    { name: 'AI', icon: '🤖' },
    { name: 'Algo', icon: '🧮' },
    { name: 'Rust', icon: '🦀' },
    { name: 'Game', icon: '🎮' },
  ];

  // Use preferences if available, otherwise use default categories
  const categories = userPreferences.tags.length > 0 
    ? [{ name: 'All', icon: '🎯' }, ...userPreferences.tags] 
    : defaultCategories;

  const tabs = [
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'monthly', label: 'Monthly', icon: TrendingUp },
    { id: 'yearly', label: 'Yearly', icon: Flame },
  ];

  useEffect(() => {
    fetchUser();
    fetchProjects();
    loadPreferences();
  }, [selectedTab]);

  useEffect(() => {
    // Filter projects when category or preferences change
    filterProjects();
  }, [selectedCategory, allProjects, userPreferences]);

  const loadPreferences = () => {
    const saved = localStorage.getItem('projectPreferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      setUserPreferences(preferences);
    }
  };

  const handlePreferencesSave = (preferences) => {
    setUserPreferences(preferences);
    setSelectedCategory('All'); // Reset to show all with new filters
  };

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual projects query
      // This is a placeholder - adjust based on your database schema
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        // Database table doesn't exist yet, use mock data
        setAllProjects(mockProjects);
      } else {
        setAllProjects(data || mockProjects);
      }
    } catch (error) {
      // Silently fallback to mock data
      setAllProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...allProjects];

    // Filter by selected category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((project) => {
        // Check if project category or tags match the selected category
        return (
          project.category === selectedCategory ||
          project.tags?.some((tag) => tag === selectedCategory)
        );
      });
    }

    // Apply preference filtering if preferences are set
    if (userPreferences.tags.length > 0) {
      const preferenceTagNames = userPreferences.tags.map((t) => t.name);
      
      if (userPreferences.mode === 'OR') {
        // OR mode: Show projects matching ANY of the preference tags
        filtered = filtered.filter((project) => {
          return (
            preferenceTagNames.includes(project.category) ||
            project.tags?.some((tag) => preferenceTagNames.includes(tag)) ||
            preferenceTagNames.includes(project.language)
          );
        });
      } else {
        // AND mode: Show projects matching ALL of the preference tags
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

    setProjects(filtered);
  };

  // Mock data for demonstration
  const mockProjects = [
    {
      id: 1,
      title: 'Heterogeneous AI Computing Virtualization Middleware for K8s',
      description:
        'This is a GPU sharing and scheduling management platform specifically designed for Kubernetes clusters.',
      author: 'Project-HAMi',
      avatar: '🔬',
      language: 'Go',
      views: 2100,
      stars: 450,
      comments: 23,
      category: 'AI',
      tags: ['Kubernetes', 'AI', 'Docker'],
      trending: true,
      daysAgo: 24,
    },
    {
      id: 2,
      title: 'Minimal Personal Cloud Photo Album Platform',
      description:
        'A powerful self-hosted personal photo album application designed specifically for organizing and sharing memories.',
      author: 'HoshinoSuzumi',
      avatar: '📸',
      language: 'JavaScript',
      views: 1700,
      stars: 340,
      comments: 18,
      category: 'JavaScript',
      tags: ['Vue.js', 'Self-hosted', 'Photos'],
      trending: false,
      daysAgo: 10,
    },
    {
      id: 3,
      title: 'Fresh Lightweight Content Sharing Platform',
      description:
        'An open-source and self-hosted lightweight content publishing platform focused on simplicity and performance.',
      author: 'lin-snow',
      avatar: '✨',
      language: 'Go',
      views: 2200,
      stars: 520,
      comments: 31,
      category: 'Tutorial',
      tags: ['Tutorial', 'Self-Hosted', 'Web App'],
      trending: true,
      daysAgo: 10,
    },
    {
      id: 4,
      title: 'Python Data Science Toolkit',
      description:
        'A comprehensive collection of data science tools and utilities for Python developers.',
      author: 'DataScience Team',
      avatar: '📊',
      language: 'Python',
      views: 3200,
      stars: 680,
      comments: 45,
      category: 'Python',
      tags: ['Python', 'AI', 'Tutorial'],
      trending: true,
      daysAgo: 5,
    },
    {
      id: 5,
      title: 'Rust Game Engine',
      description:
        'A high-performance game engine written in Rust for cross-platform game development.',
      author: 'RustGameDev',
      avatar: '🎮',
      language: 'Rust',
      views: 2800,
      stars: 920,
      comments: 67,
      category: 'Game',
      tags: ['Rust', 'Game', 'Desktop'],
      trending: false,
      daysAgo: 15,
    },
    {
      id: 6,
      title: 'Java Spring Boot Microservices',
      description:
        'A complete microservices architecture example using Spring Boot and Docker.',
      author: 'SpringDev',
      avatar: '☕',
      language: 'Java',
      views: 1950,
      stars: 410,
      comments: 28,
      category: 'Java',
      tags: ['Java', 'Docker', 'Kubernetes'],
      trending: false,
      daysAgo: 20,
    },
  ];

  const userStats = {
    contributions: 64,
    followers: 4400,
    projects: 4074,
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background gradient-mesh p-4 gap-4 flex-col">
        <div className="flex gap-4 flex-1">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1">
            {/* Navbar */}
            <SearchNavbar />

          {/* Main Layout */}
          <div className="container mx-auto px-4 py-6 pb-4 overflow-auto flex-1">
            {/* Onboarding Banner */}
            <OnboardingBanner />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar - Categories */}
              <aside className="lg:col-span-2 space-y-4">
            <Card className="glass-premium border-border backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Topics
                  </div>
                  {userPreferences.tags.length > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      {userPreferences.tags.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-1 p-4 pt-0">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? 'secondary' : 'ghost'}
                        className={`w-full justify-start text-base ${
                          selectedCategory === category.name
                            ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-base hover:bg-accent hover:glow-border-blue"
                    onClick={() => setPreferencesOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content - Feed */}
          <main className="lg:col-span-7 space-y-4">
            {/* Tabs */}
            <Card className="glass-premium border-border backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={selectedTab === tab.id ? 'default' : 'ghost'}
                        size="sm"
                        className={
                          selectedTab === tab.id
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }
                        onClick={() => setSelectedTab(tab.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </Button>
                    );
                  })}
                  <div className="ml-auto flex gap-2 items-center">
                    {userPreferences.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {userPreferences.mode} Filter Active
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-accent"
                    >
                      Featured
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-accent"
                    >
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
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <Card
                      key={i}
                      className="glass-premium border-border backdrop-blur-sm animate-pulse"
                    >
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
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
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedCategory('All');
                              setUserPreferences({ tags: [], mode: 'OR' });
                              localStorage.removeItem('projectPreferences');
                            }}
                          >
                            Clear All Filters
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card
                      key={project.id}
                      className="glass-premium border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl backdrop-blur-sm group cursor-pointer"
                      onClick={() => router.push(`/project/${project.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Project Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-accent flex items-center justify-center text-3xl border group-hover:scale-110 transition-transform">
                              {project.avatar}
                            </div>
                          </div>

                          {/* Project Info */}
                          <div className="flex-1 min-w-0">
                            {/* Title and Badge */}
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                                {project.trending && (
                                  <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                                )}
                                {project.title}
                              </h3>
                              <Badge className="ml-auto flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                                {project.trending ? '🔥' : '✨'}
                              </Badge>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {project.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className="text-xs">
                                    {project.author[0]}
                                  </AvatarFallback>
                                </Avatar>
                                {project.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                {project.language}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {project.daysAgo} days ago
                              </span>
                            </div>

                            {/* Tags and Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2 flex-wrap">
                                {project.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {project.views > 1000
                                    ? `${(project.views / 1000).toFixed(1)}k`
                                    : project.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  {project.stars}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  {project.comments}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </main>

          {/* Right Sidebar - User Info */}
          <aside className="lg:col-span-3 space-y-4">
            {/* User Profile Card */}
            <Card className="glass-premium border-border backdrop-blur-sm">
              <CardContent className="p-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {user.user_metadata?.full_name || 'User'}
                        </h3>
                        <p className="text-xs text-muted-foreground">Lv. 1 • Newbie</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Contributions
                        </span>
                        <span className="text-sm font-semibold text-green-500">
                          {userStats.contributions}/64
                        </span>
                      </div>
                      <Progress 
                        value={(userStats.contributions / 64) * 100} 
                        className="h-2" 
                        indicatorClassName="bg-green-500"
                      />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Followers
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {userStats.followers > 1000
                            ? `${(userStats.followers / 1000).toFixed(1)}k`
                            : userStats.followers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Projects
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {userStats.projects}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                      size="sm"
                      onClick={() => router.push('/profile')}
                    >
                      View Profile
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Sign in to see your profile</p>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                      onClick={() => router.push('/login')}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="glass-premium border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  SEFGH is an advanced search engine platform that revolutionizes how you find information online. It combines powerful AI-driven search capabilities with intelligent query understanding to deliver highly accurate and relevant results. The platform features a modern, GitHub-inspired dark interface with real-time search suggestions, personalized search history, and multi-language support. Built with Next.js and cutting-edge web technologies, SEFGH offers seamless authentication, customizable user profiles, and an intuitive sidebar navigation for enhanced productivity. Experience the future of search with lightning-fast performance and a beautifully crafted user experience.
                </p>
                <Separator />
                <div className="flex flex-wrap gap-2 text-xs">
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    size="sm"
                  >
                    Feedback
                  </Button>
                  <span className="text-muted-foreground">•</span>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    size="sm"
                  >
                    Business
                  </Button>
                  <span className="text-muted-foreground">•</span>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    size="sm"
                  >
                    Links
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
            </div>
          </div>
        </SidebarInset>
        </div>
      </div>

      {/* Preferences Dialog */}
      <PreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        onSave={handlePreferencesSave}
      />
    </SidebarProvider>
  );
}
