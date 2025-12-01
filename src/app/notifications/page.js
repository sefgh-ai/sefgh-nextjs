"use client";

import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { NotificationSidebar } from "./components/NotificationSidebar";
import { NotificationTopBar } from "./components/NotificationTopBar";
import { NotificationList } from "./components/NotificationList";
import { useNotifications } from "./hooks/useNotifications";
import { useNotificationFilters } from "./hooks/useNotificationFilters";
import {
  getNotificationIcon,
  getNotificationColor,
  formatTimestamp,
} from "./utils/notificationHelpers";

function NotificationsContent() {
  const { user, loading } = useAuth();
  const { isAuthenticated, isLoading } = useAuthGuard({ user, loading });
  const { filter, setFilter, readFilter, setReadFilter, searchQuery, setSearchQuery } = useNotificationFilters();

  const {
    notifications,
    loadingNotifications,
    selectedIds,
    setSelectedIds,
    savedIds,
    doneIds,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    toggleSaved,
    toggleDone,
    handleBulkAction,
    unreadCount,
    inboxCount,
  } = useNotifications(user, filter, readFilter, searchQuery);

  if (isLoading || !isAuthenticated) {
    return <PageLoadingSpinner message="Loading notifications..." />;
  }

  const savedCount = savedIds.length;
  const doneCount = doneIds.length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <NotificationSidebar
        filter={filter}
        setFilter={setFilter}
        inboxCount={inboxCount}
        savedCount={savedCount}
        doneCount={doneCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <NotificationTopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          unreadCount={unreadCount}
          readFilter={readFilter}
          setReadFilter={setReadFilter}
          handleBulkAction={handleBulkAction}
          markAllAsRead={markAllAsRead}
        />

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          <NotificationList
            loadingNotifications={loadingNotifications}
            notifications={notifications}
            filter={filter}
            searchQuery={searchQuery}
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
        </div>
      </div>
    </div>
  );
}

// Wrap the page with Suspense and Error boundary
export default function NotificationsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSpinner message="Loading notifications..." />}>
        <NotificationsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
