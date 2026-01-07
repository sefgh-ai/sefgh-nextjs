import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { mockProjects } from "@/data/mockProjects";
import { logError } from "@/lib/error-tracking";

/**
 * Custom hook to fetch and manage projects data from Supabase with real-time updates
 * @param {string} selectedTab - Currently selected tab (e.g., "latest", "monthly", "yearly")
 * @returns {Object} result
 * @returns {Array} result.allProjects - Array of all project objects (starts with mock data)
 * @returns {boolean} result.loading - Loading state indicator
 */
export function useProjects(selectedTab) {
  // Initialize with mock data immediately - no loading delay for better UX
  const [allProjects, setAllProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false); // Start as false since we have mock data

  // Create Supabase client once
  const [supabase] = useState(() => createClient());

  // Fetch projects from Supabase with real-time subscription
  useEffect(() => {
    let channel;

    const fetchProjects = async () => {
      try {
        // Determine date filter based on selectedTab
        let query = supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        // Apply time-based filters
        if (selectedTab === "monthly") {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          query = query.gte("created_at", oneMonthAgo.toISOString());
        } else if (selectedTab === "yearly") {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          query = query.gte("created_at", oneYearAgo.toISOString());
        }

        query = query.limit(50);

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching projects:", error);
          logError("projects_fetch_failed", error, { selectedTab });
        } else if (data && data.length > 0) {
          setAllProjects(data);
        }
        // Otherwise keep using mockProjects (already set as initial state)
      } catch (error) {
        console.error("Error fetching projects:", error);
        logError("projects_fetch_failed", error, { selectedTab });
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchProjects();

    // Set up real-time subscription
    channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "projects",
        },
        (payload) => {
          console.log("Real-time project change:", payload);

          if (payload.eventType === "INSERT") {
            // Add new project to the beginning
            setAllProjects((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            // Update existing project
            setAllProjects((prev) =>
              prev.map((project) =>
                project.id === payload.new.id ? payload.new : project
              )
            );
          } else if (payload.eventType === "DELETE") {
            // Remove deleted project
            setAllProjects((prev) =>
              prev.filter((project) => project.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, selectedTab]);

  return { allProjects, loading };
}
