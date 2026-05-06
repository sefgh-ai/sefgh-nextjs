/**
 * Get the site origin (scheme + domain)
 * Uses NEXT_PUBLIC_SITE_URL if available, otherwise falls back to current window location
 */
export function getSiteOrigin() {
  // Server-side: use env var
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
  
  // Client-side: prefer env var over window.location.origin for OAuth redirects
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // Fallback to current window location
  return window.location.origin
}
