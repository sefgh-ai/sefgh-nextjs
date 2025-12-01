"use client";

import { Bell } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { NotificationItem } from "./NotificationItem";

/**
 * Notification list component with loading and empty states
 */
export function NotificationList({
  loadingNotifications,
  notifications,
  filter = "inbox",
  searchQuery = "",
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
  if (loadingNotifications) {
    return (
      <div className="py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (notifications.length === 0) {
    const getEmptyStateContent = () => {
      if (searchQuery) {
        return {
          title: "No results found",
          description: "No notifications match your search.",
        };
      }
      if (filter === "saved") {
        return {
          title: "No saved notifications",
          description: "Save important notifications to access them later.",
        };
      }
      if (filter === "done") {
        return {
          title: "No completed notifications",
          description: "Mark notifications as done to keep your inbox clean.",
        };
      }
      return {
        title: "No notifications",
        description: "You're all caught up! Check back later for updates.",
      };
    };

    const { title, description } = getEmptyStateContent();

    return (
      <EmptyState
        icon={<Bell className="h-16 w-16" />}
        title={title}
        description={description}
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          savedIds={savedIds}
          doneIds={doneIds}
          markAsRead={markAsRead}
          toggleSaved={toggleSaved}
          toggleDone={toggleDone}
          deleteNotification={deleteNotification}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );
}
