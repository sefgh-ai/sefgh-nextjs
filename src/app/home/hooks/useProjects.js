import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { mockProjects } from "@/data/mockProjects"
import { logError } from "@/lib/error-tracking"

/**
 * Custom hook to fetch and manage projects data from Supabase
 * @param {string} selectedTab - Currently selected tab (e.g., "latest")
 * @returns {Object} result
 * @returns {Array} result.allProjects - Array of all project objects (starts with mock data)
 * @returns {boolean} result.loading - Loading state indicator
 */
export function useProjects(selectedTab) {
  // Initialize with mock data immediately - no loading delay for better UX
  const [allProjects, setAllProjects] = useState(mockProjects)
  const [loading, setLoading] = useState(false) // Start as false - we have data!

  // Create Supabase client once
  const [supabase] = useState(() => createClient())

  // Fetch projects from Supabase in background (doesn't block UI)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)

        // Only update if we got real data from database
        if (!error && data && data.length > 0) {
          setAllProjects(data)
        }
        // Otherwise keep using mockProjects (already set as initial state)
      } catch (error) {
        console.error("Error fetching projects:", error)
        logError('projects_fetch_failed', error, { selectedTab })
      }
    }

    fetchProjects()
  }, [supabase, selectedTab])

  return { allProjects, loading }
}
