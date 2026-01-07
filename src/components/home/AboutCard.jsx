"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function AboutCard() {
  return (
    <Card className="glass-premium border-border backdrop-blur-sm">
      <CardContent className="p-4 space-y-2">
        <div className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5" />
          About
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          SEFGH is an AI-powered search platform with intelligent query
          understanding, real-time suggestions, and multi-language support.
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-0 text-xs">
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 p-0 h-auto text-xs"
            size="sm"
          >
            Feedback
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 p-0 h-auto text-xs"
            size="sm"
          >
            Business
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 p-0 h-auto text-xs"
            size="sm"
          >
            Links
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
