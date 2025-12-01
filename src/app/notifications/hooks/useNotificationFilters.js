import { useState } from "react";

export function useNotificationFilters() {
  const [filter, setFilter] = useState("inbox"); // 'inbox', 'saved', 'done'
  const [readFilter, setReadFilter] = useState("all"); // 'all', 'unread'
  const [searchQuery, setSearchQuery] = useState("");

  return {
    filter,
    setFilter,
    readFilter,
    setReadFilter,
    searchQuery,
    setSearchQuery,
  };
}
