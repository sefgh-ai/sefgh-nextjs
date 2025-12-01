"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Check,
  CheckCheck,
  Trash2,
  Search,
  CheckCircle2,
  X,
} from "lucide-react";

export function NotificationTopBar({
  searchQuery,
  setSearchQuery,
  selectedIds,
  setSelectedIds,
  unreadCount,
  readFilter,
  setReadFilter,
  handleBulkAction,
  markAllAsRead,
}) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="p-4 space-y-4">
        {/* Search and Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("read")}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("done")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {unreadCount > 0 && selectedIds.length === 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4">
          <Button
            variant={readFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setReadFilter("all")}
          >
            All
          </Button>
          <Button
            variant={readFilter === "unread" ? "default" : "ghost"}
            size="sm"
            onClick={() => setReadFilter("unread")}
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
