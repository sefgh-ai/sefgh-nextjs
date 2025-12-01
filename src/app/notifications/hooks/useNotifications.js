import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  saveNotificationData,
  loadNotificationData,
} from "../utils/notificationHelpers";

export function useNotifications(user, filter, readFilter, searchQuery) {
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [doneIds, setDoneIds] = useState([]);
  const supabase = createClient();

  // Load saved state from localStorage
  useEffect(() => {
    if (user) {
      setSavedIds(loadNotificationData(user.id, "saved"));
      setDoneIds(loadNotificationData(user.id, "done"));
    }
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter, readFilter, searchQuery, savedIds, doneIds]);

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Apply read filter
      if (readFilter === "unread") {
        query = query.eq("is_read", false);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Apply category filter
      if (filter === "saved") {
        filteredData = filteredData.filter((n) => savedIds.includes(n.id));
      } else if (filter === "done") {
        filteredData = filteredData.filter((n) => doneIds.includes(n.id));
      } else {
        // Inbox - exclude done
        filteredData = filteredData.filter((n) => !doneIds.includes(n.id));
      }

      // Apply search
      if (searchQuery) {
        filteredData = filteredData.filter(
          (n) =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setNotifications(filteredData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    const ids = Array.isArray(notificationIds)
      ? notificationIds
      : [notificationIds];
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", ids);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setSelectedIds((prev) => prev.filter((id) => id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const toggleSaved = (notificationId) => {
    const newSaved = savedIds.includes(notificationId)
      ? savedIds.filter((id) => id !== notificationId)
      : [...savedIds, notificationId];
    setSavedIds(newSaved);
    saveNotificationData(user.id, "saved", newSaved);
  };

  const toggleDone = (notificationId) => {
    const newDone = doneIds.includes(notificationId)
      ? doneIds.filter((id) => id !== notificationId)
      : [...doneIds, notificationId];
    setDoneIds(newDone);
    saveNotificationData(user.id, "done", newDone);

    // Auto mark as read when marking done
    if (!doneIds.includes(notificationId)) {
      markAsRead(notificationId);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case "read":
        markAsRead(selectedIds);
        setSelectedIds([]);
        break;
      case "done":
        selectedIds.forEach((id) => {
          if (!doneIds.includes(id)) {
            toggleDone(id);
          }
        });
        setSelectedIds([]);
        break;
      case "delete":
        selectedIds.forEach((id) => deleteNotification(id));
        setSelectedIds([]);
        break;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const inboxCount = notifications.filter((n) => !doneIds.includes(n.id))
    .length;

  return {
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
  };
}
