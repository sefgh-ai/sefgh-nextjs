"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code, Settings, Loader2 } from "lucide-react";
import { useCategories } from "@/app/home/hooks/useCategories";

export function CategoriesSidebar({
  selectedCategory,
  onCategoryChange,
  userPreferences,
  onOpenPreferences,
}) {
  const { categories: liveCategories, loading } = useCategories();

  // Filter out "All" from live categories to avoid duplication
  const filteredLiveCategories = liveCategories.filter(
    (cat) => cat.name !== "All"
  );

  // Determine which categories to display
  // Priority: User preferences > Live database categories
  const categories =
    userPreferences?.tags?.length > 0
      ? [{ name: "All", icon: "🎯" }, ...userPreferences.tags]
      : filteredLiveCategories.length > 0
      ? [{ name: "All", icon: "🎯" }, ...filteredLiveCategories]
      : [{ name: "All", icon: "🎯" }]; // Fallback if no data

  return (
    <Card className="glass-premium border-border backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Topics
            {loading && (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            )}
          </div>
          {userPreferences?.tags?.length > 0 ? (
            <Badge className="bg-primary text-primary-foreground text-xs">
              {userPreferences.tags.length}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              {filteredLiveCategories.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-24rem)] min-h-[200px]">
          <div className="space-y-1 p-4 pt-0">
            {categories.map((category) => (
              <Button
                key={category.id || category.name}
                variant={
                  selectedCategory === category.name ? "secondary" : "ghost"
                }
                className={`w-full justify-start text-base ${
                  selectedCategory === category.name
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={() => onCategoryChange(category.name)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                {category.usage_count !== undefined &&
                  category.usage_count > 0 && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {category.usage_count}
                    </span>
                  )}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-base hover:bg-accent hover:glow-border-blue"
            onClick={onOpenPreferences}
          >
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
