"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check,
  Bookmark,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Individual notification item component (memoized for performance)
 */
export const NotificationItem = React.memo(function NotificationItem({
  notification,
  selectedIds,
  setSelectedIds,
  savedIds,
  doneIds,
  markAsRead,
  toggleSaved,
  toggleDone,
  deleteNotification,
  getNotificationIcon,
  getNotificationColor,
  formatTimestamp,
}) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "p-4 hover:bg-muted/50 transition-colors group",
        !notification.is_read && "bg-primary/5 border-l-2 border-l-primary"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={selectedIds.includes(notification.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedIds([...selectedIds, notification.id]);
            } else {
              setSelectedIds(
                selectedIds.filter((id) => id !== notification.id)
              );
            }
          }}
          className="mt-1"
        />

        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border",
            getNotificationColor(notification.type)
          )}
        >
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {notification.message}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(notification.created_at)}
                </span>
                {notification.link && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                    onClick={() => router.push(notification.link)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSaved(notification.id)}
                title={savedIds.includes(notification.id) ? "Unsave" : "Save"}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    savedIds.includes(notification.id) &&
                      "fill-current text-primary"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleDone(notification.id)}
                title={
                  doneIds.includes(notification.id)
                    ? "Unmark done"
                    : "Mark done"
                }
              >
                <CheckCircle2
                  className={cn(
                    "h-4 w-4",
                    doneIds.includes(notification.id) &&
                      "fill-current text-green-500"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotification(notification.id)}
                title="Delete"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
