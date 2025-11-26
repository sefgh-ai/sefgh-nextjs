"use client"

import UsageContributionsCard from '@/components/usage-contributions/UsageContributionsCard'

/**
 * Activity tab for Account Settings
 * Shows user's SEFGH usage contributions and statistics
 */
export default function ActivityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Activity & Usage</h3>
        <p className="text-sm text-muted-foreground mt-1">
          View your SEFGH activity contributions and usage patterns over time
        </p>
      </div>

      <UsageContributionsCard year={2025} />

      {/* Additional Activity Info */}
      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <div className="glass-premium rounded-lg border border-white/10 p-4">
          <div className="text-sm text-muted-foreground">Total Actions</div>
          <div className="text-2xl font-bold mt-1">View above</div>
        </div>
        <div className="glass-premium rounded-lg border border-white/10 p-4">
          <div className="text-sm text-muted-foreground">Active Days</div>
          <div className="text-2xl font-bold mt-1">View above</div>
        </div>
        <div className="glass-premium rounded-lg border border-white/10 p-4">
          <div className="text-sm text-muted-foreground">Current Streak</div>
          <div className="text-2xl font-bold mt-1">View above</div>
        </div>
      </div>

      {/* Activity Types Breakdown (Future Enhancement) */}
      <div className="glass-premium rounded-lg border border-white/10 p-6 mt-6">
        <h4 className="font-medium mb-4">Activity Breakdown</h4>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown by activity type will be available in a future update.
          This will include: searches, chat interactions, repositories viewed, API usage, and more.
        </p>
      </div>
    </div>
  )
}
