"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code, Settings } from "lucide-react";

const DEFAULT_CATEGORIES = [
  { name: "All", icon: "🎯" },
  { name: "Python", icon: "🐍" },
  { name: "Java", icon: "☕" },
  { name: "C++", icon: "⚙️" },
  { name: "JavaScript", icon: "⚡" },
  { name: "Tutorial", icon: "📚" },
  { name: "AI", icon: "🤖" },
  { name: "Algo", icon: "🧮" },
  { name: "Rust", icon: "🦀" },
  { name: "Game", icon: "🎮" },
];

export function CategoriesSidebar({
  selectedCategory,
  onCategoryChange,
  userPreferences,
  onOpenPreferences,
}) {
  const categories =
    userPreferences?.tags?.length > 0
      ? [{ name: "All", icon: "🎯" }, ...userPreferences.tags]
      : DEFAULT_CATEGORIES;

  return (
    <Card className="glass-premium border-border backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Topics
          </div>
          {userPreferences?.tags?.length > 0 && (
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
