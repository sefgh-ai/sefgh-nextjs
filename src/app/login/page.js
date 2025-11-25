'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Github } from "lucide-react"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { SignInPage } from "@/components/ui/sign-in"

// Login page testimonials
const loginTestimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Emma Wilson",
    handle: "@emmawilson",
    text: "SEFGH-AI has transformed how I search for GitHub repos. Absolutely incredible!"
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Michael Chen",
    handle: "@michaeldev",
    text: "The AI-powered search is a game changer. Found exactly what I needed in seconds."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Sarah Johnson",
    handle: "@sarahcodes",
    text: "Best developer tool I've used this year. Clean, fast, and incredibly powerful."
  }
];

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
        description: "You've successfully signed in. Redirecting...",
        duration: 3000,
      })
      
      // Redirect to search page on success
      setTimeout(() => {
        router.push('/search')
        router.refresh()
      }, 1000)
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
    });
  }

  const handleCreateAccount = () => {
    router.push('/signup')
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

  const GithubButton = (
    <button 
      onClick={handleGithubLogin}
      className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      <Github className="h-5 w-5" />
      GitHub
    </button>
  );

  return (
    <>
      {/* Theme Toggle - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="h-9 w-9"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <SignInPage
        title={
          <span className="font-semibold text-foreground">
            Welcome back to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              SEFGH-AI
            </span>
          </span>
        }
        description="Sign in to access your AI-powered GitHub search platform"
        heroImageSrc="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=2160&q=80"
        testimonials={loginTestimonials}
        onSignIn={handleSubmit}
        onGoogleSignIn={handleGoogleLogin}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        loading={loading}
        error={error}
        GithubButton={GithubButton}
      />
    </>
  )
}
