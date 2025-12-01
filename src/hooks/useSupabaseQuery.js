import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Generic hook for Supabase queries with loading and error states
 * @param {Object} options
 * @param {string} options.table - Table name
 * @param {Function} [options.queryBuilder] - Custom query builder function
 * @param {Array} [options.dependencies=[]] - Dependencies for re-fetching
 * @param {boolean} [options.enabled=true] - Whether to enable the query
 * @returns {Object} Query state and methods
 */
export function useSupabaseQuery({
  table,
  queryBuilder,
  dependencies = [],
  enabled = true,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select("*");

      if (queryBuilder) {
        query = queryBuilder(query);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setData(result);
    } catch (err) {
      console.error(`Error fetching from ${table}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [table, queryBuilder, enabled, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for Supabase mutations (insert, update, delete)
 * @param {Object} options
 * @param {string} options.table - Table name
 * @param {Function} [options.onSuccess] - Success callback
 * @param {Function} [options.onError] - Error callback
 * @returns {Object} Mutation methods and state
 */
export function useSupabaseMutation({ table, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const supabase = createClient();

  const insert = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);

        const { data: result, error: insertError } = await supabase
          .from(table)
          .insert(data)
          .select();

        if (insertError) throw insertError;

        if (onSuccess) onSuccess(result);
        return { data: result, error: null };
      } catch (err) {
        console.error(`Error inserting into ${table}:`, err);
        setError(err.message);
        if (onError) onError(err);
        return { data: null, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [table, onSuccess, onError]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError(null);

        const { data: result, error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq("id", id)
          .select();

        if (updateError) throw updateError;

        if (onSuccess) onSuccess(result);
        return { data: result, error: null };
      } catch (err) {
        console.error(`Error updating ${table}:`, err);
        setError(err.message);
        if (onError) onError(err);
        return { data: null, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [table, onSuccess, onError]
  );

  const remove = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        if (onSuccess) onSuccess();
        return { error: null };
      } catch (err) {
        console.error(`Error deleting from ${table}:`, err);
        setError(err.message);
        if (onError) onError(err);
        return { error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [table, onSuccess, onError]
  );

  return {
    insert,
    update,
    remove,
    loading,
    error,
  };
}
