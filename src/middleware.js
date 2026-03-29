import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Short-circuit for anonymous users to avoid a costly Supabase roundtrip on every request
  const hasSupabaseSession =
    request.cookies.has("sb-access-token") ||
    request.cookies.has("sb-refresh-token");

  // Skip auth work for static HEAD/OPTIONS requests and users without Supabase cookies
  if (request.method === "HEAD" || request.method === "OPTIONS" || !hasSupabaseSession) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session in middleware:", error);
  }

  // Redirect logged-in users from landing page to home
  // BUT allow PWA start_url to work (has ?source=pwa)
  const isPWALaunch = request.nextUrl.searchParams.get("source") === "pwa";
  if (pathname === "/" && session && !isPWALaunch) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and PWA manifest
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|css|woff|woff2|ttf|eot)$).*)",
  ],
};
