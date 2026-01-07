"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

// Try to get cached user from localStorage for instant initial render
function getCachedUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(
      "sb-" +
        process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] +
        "-auth-token"
    );
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.user ?? null;
    }
  } catch {
    // Ignore errors - just return null
  }
  return null;
}

export const AuthProvider = ({ children }) => {
  // Initialize with cached user for instant UI (will be verified async)
  const [user, setUser] = useState(() => getCachedUser());
  const [loading, setLoading] = useState(() => getCachedUser() === null);
  const router = useRouter();
  const hasInitialized = useRef(false);

  // Memoize supabase client to prevent recreation
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    // Verify session with server (but UI already shows cached state)
    const verifySession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        if (isMounted) {
          const serverUser = session?.user ?? null;
          // Only update if different from cached user
          if (JSON.stringify(serverUser?.id) !== JSON.stringify(user?.id)) {
            setUser(serverUser);
          }
          setLoading(false);
          hasInitialized.current = true;
        }
      } catch (error) {
        console.error("Error in getSession:", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
          hasInitialized.current = true;
        }
      }
    };

    // Shorter timeout - 2 seconds max
    const loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn(
          "[AuthContext] Loading timeout - forcing loading to false"
        );
        setLoading(false);
        hasInitialized.current = true;
      }
    }, 2000);

    verifySession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip if this is initial session and we've already initialized
      if (event === "INITIAL_SESSION" && hasInitialized.current) {
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "USER_UPDATED" && session?.user) {
        setUser(session.user);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    try {
      // Force refresh session from server to get latest user metadata
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        return session.user;
      }

      return null;
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      signOut,
    }),
    [user, loading, refreshUser, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Return safe defaults during SSR or when outside provider
  if (!context || Object.keys(context).length === 0) {
    return {
      user: null,
      loading: true,
      refreshUser: async () => null,
      signOut: async () => {},
    };
  }
  return context;
};
