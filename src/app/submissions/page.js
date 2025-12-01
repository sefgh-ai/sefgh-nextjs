'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useSubmissions } from "./hooks/useSubmissions"
import SubmissionCard from "./components/SubmissionCard"
import SubmissionsEmptyState from "./components/SubmissionsEmptyState"
import SubmissionsLoadingSkeleton from "./components/SubmissionsLoadingSkeleton"

export default function SubmissionsPage() {
  const { user } = useAuth()
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard()
  const { submissions, loading, handleDelete } = useSubmissions(user)

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Submissions</h1>
          <SubmissionsLoadingSkeleton />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Submissions</h1>
          <SubmissionsEmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Submissions</h1>
          <p className="text-muted-foreground">
            Manage your submitted repositories ({submissions.length})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <SubmissionCard 
              key={submission.id}
              submission={submission}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
