'use client'

import React from 'react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

/**
 * Empty state component for submissions page
 */
const SubmissionsEmptyState = React.memo(() => {
  const router = useRouter()

  return (
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
  )
})

SubmissionsEmptyState.displayName = 'SubmissionsEmptyState'

export default SubmissionsEmptyState
