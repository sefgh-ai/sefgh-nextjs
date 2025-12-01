"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Inbox, Bookmark, CheckCircle2 } from "lucide-react";

export function NotificationSidebar({
  filter,
  setFilter,
  inboxCount,
  savedCount,
  doneCount,
}) {
  const router = useRouter();

  return (
    <div className="w-64 border-r border-border p-4 space-y-2">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {/* Filters */}
      <Button
        variant={filter === "inbox" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setFilter("inbox")}
      >
        <Inbox className="h-4 w-4 mr-2" />
        Inbox
        {inboxCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {inboxCount}
          </Badge>
        )}
      </Button>

      <Button
        variant={filter === "saved" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setFilter("saved")}
      >
        <Bookmark className="h-4 w-4 mr-2" />
        Saved
        {savedCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {savedCount}
          </Badge>
        )}
      </Button>

      <Button
        variant={filter === "done" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setFilter("done")}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Done
        {doneCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {doneCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
