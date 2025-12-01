'use client'

import React from 'react'

/**
 * Loading skeleton for submissions page
 */
const SubmissionsLoadingSkeleton = React.memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-card/50 rounded-xl animate-pulse" />
      ))}
    </div>
  )
})

SubmissionsLoadingSkeleton.displayName = 'SubmissionsLoadingSkeleton'

export default SubmissionsLoadingSkeleton
