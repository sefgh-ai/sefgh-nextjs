"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/contexts/NotificationContext";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const tooltipTimeout = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle hover for tooltip
  const handleMouseEnter = useCallback(() => {
    if (!isOpen) {
      tooltipTimeout.current = setTimeout(() => {
        setShowTooltip(true);
      }, 300);
    }
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    setShowTooltip(false);
  }, []);

  const handleBellClick = useCallback(() => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
  }, []);

  const handleMarkAsRead = useCallback(
    async (notificationId) => {
      await markAsRead(notificationId);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleDeleteNotification = useCallback(
    async (notificationId, event) => {
      event.stopPropagation();
      await deleteNotification(notificationId);
    },
    [deleteNotification]
  );

  const handleNotificationClick = useCallback(
    async (notification) => {
      if (!notification.is_read) {
        await handleMarkAsRead(notification.id);
      }

      if (notification.link) {
        setIsOpen(false);
        router.push(notification.link);
      }
    },
    [handleMarkAsRead, router]
  );

  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✕";
      default:
        return "ℹ";
    }
  }, []);

  const getNotificationColor = useCallback((type) => {
    switch (type) {
      case "success":
        return "text-green-500 bg-green-500/10";
      case "warning":
        return "text-yellow-500 bg-yellow-500/10";
      case "error":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-blue-500 bg-blue-500/10";
    }
  }, []);

  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const latestNotification = useMemo(
    () => notifications.find((n) => !n.is_read) || notifications[0],
    [notifications]
  );

  return (
    <div className="relative">
      <div
        ref={bellRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBellClick}
          className="relative h-10 w-10 rounded-xl hover:glow-border-cyan transition-all"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in fade-in zoom-in duration-300"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Hover Tooltip - Latest Notification Preview */}
      {showTooltip && !isOpen && latestNotification && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-background/98 backdrop-blur-xl border border-border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  getNotificationColor(latestNotification.type)
                )}
              >
                {getNotificationIcon(latestNotification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                  {latestNotification.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {latestNotification.message}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(latestNotification.created_at)}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Click bell to see all notifications
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Dropdown - Toggle on Click */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-background/98 backdrop-blur-xl border border-border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No notifications yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "group relative p-3 rounded-xl mb-2 transition-all cursor-pointer",
                      notification.is_read
                        ? "bg-muted/30 hover:bg-muted/50"
                        : "bg-primary/5 hover:bg-primary/10 border border-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
                          getNotificationColor(notification.type)
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) =>
                              handleDeleteNotification(notification.id, e)
                            }
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 flex-shrink-0 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.created_at)}
                          </span>
                          {notification.link && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/notifications");
                }}
                className="text-xs w-full hover:bg-primary/10"
              >
                View all notifications →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
