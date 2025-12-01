'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useSubmissions } from "./hooks/useSubmissions"
import SubmissionCard from "./components/SubmissionCard"
import SubmissionsEmptyState from "./components/SubmissionsEmptyState"
import SubmissionsLoadingSkeleton from "./components/SubmissionsLoadingSkeleton"
import SubmissionsLayout from "./components/SubmissionsLayout"

export default function SubmissionsPage() {
  const { user } = useAuth()
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard()
  const { submissions, loading, handleDelete } = useSubmissions(user)

  if (authLoading || loading) {
    return (
      <SubmissionsLayout title="Your Submissions">
        <SubmissionsLoadingSkeleton />
      </SubmissionsLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (submissions.length === 0) {
    return (
      <SubmissionsLayout title="Your Submissions">
        <SubmissionsEmptyState />
      </SubmissionsLayout>
    )
  }

  return (
    <SubmissionsLayout 
      title="Your Submissions"
      subtitle={`Manage your submitted repositories (${submissions.length})`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <SubmissionCard 
            key={submission.id}
            submission={submission}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </SubmissionsLayout>
  )
}
