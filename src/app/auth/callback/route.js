import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Send welcome notification to new users (server-side)
 */
async function sendWelcomeNotification(supabase, userId, userName) {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Welcome to SEFGH! 🎉",
      message: `Hey ${
        userName || "there"
      }! We're excited to have you. Start exploring AI-powered GitHub search and discover amazing repositories!`,
      type: "success",
      link: "/search",
    });
  } catch (error) {
    // Don't fail auth if notification fails
    console.error("Failed to send welcome notification:", error);
  }
}

/**
 * Check if user is new (created in last 5 minutes)
 */
function isNewUser(user) {
  if (!user?.created_at) return false;
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  return createdAt > fiveMinutesAgo;
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && isNewUser(user)) {
        // New user - send welcome notification
        const userName =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0];
        await sendWelcomeNotification(supabase, user.id, userName);
      }

      // Redirect to home - onboarding banner will show there if needed
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
