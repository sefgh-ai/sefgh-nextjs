import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to guard routes that require authentication
 * Redirects to login if user is not authenticated
 * @param {Object} options
 * @param {Object|null} options.user - User object from auth context
 * @param {boolean} options.loading - Loading state from auth context
 * @param {string} [options.redirectTo="/login"] - Redirect path if not authenticated
 * @returns {boolean} isAuthenticated - Whether user is authenticated
 */
export function useAuthGuard({ user, loading, redirectTo = "/login" }) {
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { isAuthenticated: !!user, isLoading: loading };
}
