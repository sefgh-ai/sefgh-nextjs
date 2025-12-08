'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { AuthPage } from "@/components/ui/auth-page"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setTheme, theme } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      toast.info("Already logged in", {
        description: "Redirecting to search page...",
      })
      router.push('/search')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const userName = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'there'
      
      toast.success(`Welcome back, ${userName}! 🎉`, {
        description: "You've successfully signed in.",
        duration: 2000,
      })
      
      // Redirect to search page immediately
      router.push('/search')
    } catch (error) {
      setError(error.message)
      
      // Provide user-friendly error messages
      if (error.message === "Invalid login credentials") {
        toast.error("Invalid credentials", {
          description: "Email or password is incorrect. Please try again or sign up for a new account.",
        })
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Email not verified", {
          description: "Please check your email and verify your account before logging in.",
        })
      } else {
        toast.error("Login failed", {
          description: error.message,
        })
      }
      
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = () => {
    toast.info("Password Reset", {
      description: "Password reset feature coming soon! Check your email for instructions.",
    })
  }

  const handleGithubLogin = async () => {
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      toast.loading("Redirecting to GitHub...", {
        description: "Please authorize the app",
      })
    } catch (error) {
      setError(error.message)
      toast.error("GitHub login failed", {
        description: error.message,
      })
      console.error("GitHub login error:", error)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      toast.loading("Redirecting to Google...", {
        description: "Please authorize the app",
      })
    } catch (error) {
      setError(error.message)
      toast.error("Google login failed", {
        description: error.message,
      })
      console.error("Google login error:", error)
      setLoading(false)
    }
  }

  return (
    <>
      <AuthPage
        mode="signin"
        brandName="SEFGH-AI"
        homeLink="/"
        onSubmit={handleSubmit}
        onGoogleAuth={handleGoogleLogin}
        onGithubAuth={handleGithubLogin}
        onResetPassword={handleResetPassword}
        loading={loading}
        error={error}
        testimonial={{
          text: "SEFGH-AI has transformed how I search for GitHub repos. The AI-powered search is a game changer!",
          author: "Adeel, Developer"
        }}
      />
    </>
  )
}
