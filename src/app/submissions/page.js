'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Trash2, Calendar, ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view submissions")
      router.push('/login')
      return
    }

    if (user) {
      fetchSubmissions()
    }
  }, [user, authLoading])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('repo_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (submissionId) => {
    // Remove from UI only (Option B - don't delete from database)
    setSubmissions(prev => prev.filter(s => s.id !== submissionId))
    toast.success("Submission removed from view")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Submissions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Submissions</h1>
          <p className="text-muted-foreground">
            Manage your submitted repositories
          </p>
        </div>

        {/* Empty State */}
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass-premium rounded-2xl border border-white/10">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <svg
                  className="mx-auto h-24 w-24 text-muted-foreground opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by submitting your first GitHub repository!
              </p>
              <Button
                onClick={() => router.push('/search')}
                className="bg-primary hover:bg-primary/90"
              >
                Submit a Project
              </Button>
            </div>
          </div>
        ) : (
          /* Submissions Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="group glass-premium border border-white/10 rounded-xl p-6 hover:shadow-premium-lg transition-all duration-300 hover:border-blue-500/30"
              >
                {/* Header with Delete Button */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary flex-1 line-clamp-2">
                    {submission.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="ml-2 p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove from view"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">
                  {submission.description}
                </p>

                {/* Tags */}
                {submission.tags && submission.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {submission.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {submission.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-md bg-muted/20 text-muted-foreground">
                        +{submission.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Submitted Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>Submitted {formatDate(submission.submitted_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(submission.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    View on GitHub
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
