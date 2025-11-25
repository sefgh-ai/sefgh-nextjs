'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Loader2, User, Mail, Calendar, Shield, Upload, ArrowLeft, Globe, FileText } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/Header"
import { AvatarUpload } from "@/components/AvatarUpload"

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [profile, setProfile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState("")

  // Fetch profile data from profiles table
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
        setEmail(data.email || "")
        setBio(data.bio || "")
        setWebsite(data.website || "")
        setAvatarUrl(data.avatar_url || "")
      }
    }

    fetchProfile()
  }, [user, supabase])

  // Update local state when user changes (e.g., after avatar upload)
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login first", {
        description: "You need to be logged in to view your profile",
      })
      router.push('/login')
    }
  }, [user, authLoading, router])

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ')
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update both auth user metadata and profiles table
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        }
      })

      if (authError) throw authError

      // Update profiles table (bio and website)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: bio,
          website: website,
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Refresh user data
      await refreshUser()

      toast.success("Profile updated! ✨", {
        description: "Your profile information has been saved successfully.",
        duration: 3000,
      })
    } catch (error) {
      toast.error("Update failed", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUploadSuccess = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex-1" />
          <Header />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <AvatarUpload
                currentAvatarUrl={avatarUrl || user?.user_metadata?.avatar_url}
                userInitials={getUserInitials()}
                onUploadSuccess={handleAvatarUploadSuccess}
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.user_metadata?.full_name || 'User Profile'}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {formatDate(user?.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{user?.role || 'user'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="pl-10 min-h-[100px]"
                      maxLength={500}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bio.length}/500 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account ID</span>
                  <span className="text-sm font-mono">{user?.id?.slice(0, 8)}...</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  <span className="text-sm">
                    {user?.email_confirmed_at ? (
                      <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">⚠ Not Verified</span>
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Sign In</span>
                  <span className="text-sm">{formatDate(user?.last_sign_in_at)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Authentication</span>
                  <span className="text-sm capitalize">
                    {user?.app_metadata?.provider || 'email'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity Statistics</CardTitle>
              <CardDescription>
                Your usage and activity overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Searches</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Bookmarks</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
