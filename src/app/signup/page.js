"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/ui/auth-page";
import { getSiteOrigin } from "@/lib/utils/site-config";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setTheme, theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      toast.info("Already logged in", {
        description: "Redirecting to search page...",
      });
      router.push("/search");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      toast.error("Passwords don't match!", {
        description: "Please make sure both passwords are identical.",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created successfully!", {
        description: "Check your email to verify your account.",
        duration: 5000,
      });

      // Redirect to login after successful signup
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
      toast.error("Signup failed", {
        description: error.message,
      });
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${getSiteOrigin()}/auth/callback`,
        },
      });

      if (error) throw error;

      toast.loading("Redirecting to GitHub...", {
        description: "Please authorize the app",
      });
    } catch (error) {
      setError(error.message);
      toast.error("GitHub signup failed", {
        description: error.message,
      });
      console.error("GitHub signup error:", error);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getSiteOrigin()}/auth/callback`,
        },
      });

      if (error) throw error;

      toast.loading("Redirecting to Google...", {
        description: "Please authorize the app",
      });
    } catch (error) {
      setError(error.message);
      toast.error("Google signup failed", {
        description: error.message,
      });
      console.error("Google signup error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <AuthPage
        mode="signup"
        brandName="SEFGH-AI"
        homeLink="/"
        onSubmit={handleSubmit}
        onGoogleAuth={handleGoogleSignup}
        onGithubAuth={handleGithubSignup}
        loading={loading}
        error={error}
        testimonial={{
          text: "Joining SEFGH-AI was the best decision. The platform is intuitive, powerful, and the onboarding was seamless!",
          author: "James Mitchell, Software Engineer",
        }}
      />
    </>
  );
}
