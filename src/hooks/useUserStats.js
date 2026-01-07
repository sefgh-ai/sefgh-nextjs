"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUserStats(userId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      // Try to fetch existing stats
      let { data, error: fetchError } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      // If no stats exist, create them
      if (fetchError && fetchError.code === "PGRST116") {
        const { data: newData, error: insertError } = await supabase
          .from("user_stats")
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }
        data = newData;
      } else if (fetchError) {
        throw fetchError;
      }

      setStats(data);
      setError(null);
    } catch (err) {
      console.error("[useUserStats] Error fetching stats:", err);
      setError(err.message);
      // Fallback to default stats
      setStats({
        level: 1,
        title: "Newbie",
        xp: 0,
        xp_to_next_level: 100,
        contributions: 0,
        contributions_max: 64,
        followers: 0,
        following: 0,
        projects: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchStats();

    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`user_stats:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_stats",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("[useUserStats] Real-time update:", payload);
          if (payload.new) {
            setStats(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchStats]);

  // Function to update stats
  const updateStats = useCallback(
    async (updates) => {
      if (!userId) return { error: "No user ID" };

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_stats")
          .update(updates)
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;
        setStats(data);
        return { data };
      } catch (err) {
        console.error("[useUserStats] Error updating stats:", err);
        return { error: err.message };
      }
    },
    [userId]
  );

  // Function to increment a specific stat
  const incrementStat = useCallback(
    async (statName, amount = 1) => {
      if (!userId || !stats) return { error: "No user ID or stats" };

      const currentValue = stats[statName] || 0;
      return updateStats({ [statName]: currentValue + amount });
    },
    [userId, stats, updateStats]
  );

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
    updateStats,
    incrementStat,
  };
}
