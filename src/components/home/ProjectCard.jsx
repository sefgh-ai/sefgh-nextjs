"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Star, MessageSquare, Clock, Flame } from "lucide-react";

/**
 * Extract owner and repo name from GitHub URL
 * @param {string} githubUrl - Full GitHub URL (e.g., https://github.com/owner/repo)
 * @returns {{ owner: string, repo: string } | null}
 */
function parseGitHubUrl(githubUrl) {
  if (!githubUrl) return null;

  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""), // Remove .git suffix if present
      };
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
  }

  return null;
}

export function ProjectCard({ project }) {
  const router = useRouter();

  // Parse GitHub URL to get owner and repo
  const repoInfo = parseGitHubUrl(project.github_url);

  // Determine the route to navigate to
  const projectRoute = repoInfo
    ? `/repo/${repoInfo.owner}/${repoInfo.repo}`
    : project.github_url // If we have URL but can't parse, open externally
    ? project.github_url
    : null; // No URL available

  const handleClick = () => {
    if (!projectRoute) {
      console.warn("No route available for project:", project.title);
      return;
    }

    // If it's an external URL (starts with http), open in new tab
    if (projectRoute.startsWith("http")) {
      window.open(projectRoute, "_blank", "noopener,noreferrer");
    } else {
      // Navigate to internal route
      router.push(projectRoute);
    }
  };

  return (
    <Card
      className="glass-premium border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl backdrop-blur-sm group cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          {/* Project Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-muted to-accent flex items-center justify-center text-2xl sm:text-3xl border group-hover:scale-110 transition-transform">
              {project.avatar}
            </div>
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            {/* Title and Badge */}
            <div className="flex items-start gap-2 mb-1 sm:mb-2">
              <h3 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-1 sm:gap-2 truncate">
                {project.trending && (
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 animate-pulse flex-shrink-0" />
                )}
                <span className="truncate">{project.title}</span>
              </h3>
              <Badge className="ml-auto flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                {project.trending ? "🔥" : "✨"}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
              {project.description}
            </p>

            {/* Meta Info - Simplified on mobile */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground mb-2 sm:mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Avatar className="w-4 h-4">
                  <AvatarFallback className="text-xs">
                    {project.author[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{project.author}</span>
                <span className="sm:hidden">
                  {project.author.split(" ")[0]}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                {project.language}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {project.daysAgo} days ago
              </span>
            </div>

            {/* Tags and Stats */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {project.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-1.5 sm:px-2"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 sm:hidden">
                    +{project.tags.length - 2}
                  </Badge>
                )}
                {project.tags.slice(2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-2 hidden sm:inline-flex"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  {project.stars}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {project.views > 1000
                    ? `${(project.views / 1000).toFixed(1)}k`
                    : project.views}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {project.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="glass-premium border-border backdrop-blur-sm animate-pulse">
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-muted flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-5 sm:h-6 bg-muted rounded w-3/4 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 sm:h-4 bg-muted rounded w-2/3 mb-2 sm:mb-3"></div>
            <div className="flex gap-2">
              <div className="h-4 sm:h-5 bg-muted rounded w-12 sm:w-16"></div>
              <div className="h-4 sm:h-5 bg-muted rounded w-12 sm:w-16"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
