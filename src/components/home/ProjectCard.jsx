"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Star, MessageSquare, Clock, Flame } from "lucide-react";

export function ProjectCard({ project }) {
  const router = useRouter();

  return (
    <Card
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
                {project.trending ? "🔥" : "✨"}
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
                  <Badge key={tag} variant="outline" className="text-xs">
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
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="glass-premium border-border backdrop-blur-sm animate-pulse">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted"></div>
          <div className="flex-1">
            <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-muted rounded w-16"></div>
              <div className="h-5 bg-muted rounded w-16"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
