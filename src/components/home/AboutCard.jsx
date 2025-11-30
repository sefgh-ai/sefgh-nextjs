"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";

export function AboutCard() {
  return (
    <Card className="glass-premium border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          About
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          SEFGH is an advanced search engine platform that revolutionizes how
          you find information online. It combines powerful AI-driven search
          capabilities with intelligent query understanding to deliver highly
          accurate and relevant results. The platform features a modern,
          GitHub-inspired dark interface with real-time search suggestions,
          personalized search history, and multi-language support. Built with
          Next.js and cutting-edge web technologies, SEFGH offers seamless
          authentication, customizable user profiles, and an intuitive sidebar
          navigation for enhanced productivity. Experience the future of search
          with lightning-fast performance and a beautifully crafted user
          experience.
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
  );
}
