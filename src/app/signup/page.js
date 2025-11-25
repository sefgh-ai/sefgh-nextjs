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
import { SignUpPage } from "@/components/ui/sign-up"

// Signup page testimonials
const signupTestimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/86.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "Joining SEFGH-AI was the best decision. The platform is intuitive and powerful."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/21.jpg",
    name: "Lisa Anderson",
    handle: "@lisatech",
    text: "Sign up was seamless! Now I can't imagine working without this tool."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "James Taylor",
    handle: "@jamescodes",
    text: "SEFGH-AI has everything I need. The onboarding experience was fantastic!"
  }
];

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError("Passwords don't match!")
      toast.error("Passwords don't match!", {
        description: "Please make sure both passwords are identical.",
      })
      setLoading(false)
      return
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
      })

      if (error) throw error

      setSuccess(true)
      toast.success("Account created successfully!", {
        description: "Check your email to verify your account. Redirecting to login...",
      })
      
      // Redirect to login after successful signup
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setError(error.message)
      toast.error("Signup failed", {
        description: error.message,
      })
      console.error("Signup error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleGithubSignup = async () => {
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
      toast.error("GitHub signup failed", {
        description: error.message,
      })
      console.error("GitHub signup error:", error)
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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
      toast.error("Google signup failed", {
        description: error.message,
      })
      console.error("Google signup error:", error)
      setLoading(false)
    }
  }

  const GithubButton = (
    <button 
      onClick={handleGithubSignup}
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

      <SignUpPage
        title={
          <span className="font-semibold text-foreground">
            Join{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              SEFGH-AI
            </span>
          </span>
        }
        description="Create your account and unlock the power of AI-driven GitHub search"
        heroImageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2160&q=80"
        testimonials={signupTestimonials}
        onSignUp={handleSubmit}
        onGoogleSignUp={handleGoogleSignup}
        onSignIn={handleSignIn}
        loading={loading}
        error={error}
        success={success}
        GithubButton={GithubButton}
      />
    </>
  )
}
