"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Users, Code, Activity } from "lucide-react";

export function UserProfileCard({ user, loading }) {
  const router = useRouter();

  const userStats = {
    contributions: 64,
    followers: 4400,
    projects: 4074,
  };

  if (loading) {
    return (
      <Card className="glass-premium border-border backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="glass-premium border-border backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Sign in to see your profile
            </p>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-premium border-border backdrop-blur-sm">
      <CardContent className="p-6">
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
                {user.user_metadata?.full_name || "User"}
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
            onClick={() => router.push("/profile")}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
