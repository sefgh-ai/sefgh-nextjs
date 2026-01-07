import { createBrowserClient } from "@supabase/ssr";

// Singleton instance to prevent multiple clients being created
// Use globalThis for browser-safe singleton pattern that survives HMR
const globalForSupabase = typeof window !== "undefined" ? window : globalThis;

export function createClient() {
  if (globalForSupabase.__supabaseClient) {
    return globalForSupabase.__supabaseClient;
  }

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  globalForSupabase.__supabaseClient = client;
  return client;
}
