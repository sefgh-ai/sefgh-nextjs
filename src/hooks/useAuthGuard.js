import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to guard routes that require authentication
 * Redirects to login if user is not authenticated
 * @param {Object} [options]
 * @param {Object|null} [options.user] - User object from auth context (optional, will use useAuth if not provided)
 * @param {boolean} [options.loading] - Loading state from auth context (optional, will use useAuth if not provided)
 * @param {string} [options.redirectTo="/login"] - Redirect path if not authenticated
 * @returns {{ isAuthenticated: boolean, isLoading: boolean }}
 */
export function useAuthGuard(options = {}) {
  const authContext = useAuth();
  const { 
    user = authContext.user, 
    loading = authContext.loading, 
    redirectTo = "/login" 
  } = options;
  
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { isAuthenticated: !!user, isLoading: loading };
}
