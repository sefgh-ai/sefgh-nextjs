/**
 * EXAMPLE: Real API Integration for Usage Contributions
 * 
 * This file demonstrates how to replace mock data with real API calls
 * to the existing /api/activity endpoint.
 * 
 * Place this code in your Profile page or create a wrapper component.
 */

"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UsageContributionsCard from '@/components/usage-contributions/UsageContributionsCard'
import { Loader2 } from 'lucide-react'

export default function RealUsageContributionsExample() {
  const { user } = useAuth()
  const [activityData, setActivityData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchActivityData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch from existing API endpoint
        const response = await fetch('/api/activity')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform API response to UsageDay format
        // The API returns data in grid format (weeks x days)
        const usageDays = data.grid.flat().map(day => ({
          date: day.date,     // Already in ISO format: "2025-01-15"
          count: day.count    // Integer count
        }))
        
        setActivityData(usageDays)
        setError(null)
      } catch (err) {
        console.error('Error fetching activity data:', err)
        setError(err.message)
        // Fall back to null (will use mock data)
        setActivityData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 glass-premium rounded-xl border border-white/10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading activity data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-premium rounded-xl border border-red-500/20 p-6">
        <p className="text-sm text-red-500">
          Failed to load activity data: {error}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Falling back to mock data for demonstration
        </p>
        <UsageContributionsCard 
          year={new Date().getFullYear()}
          data={null} // Will use mock data
        />
      </div>
    )
  }

  return (
    <UsageContributionsCard 
      year={new Date().getFullYear()}
      data={activityData}
    />
  )
}

/**
 * ALTERNATIVE: Use SWR for automatic revalidation
 * 
 * Install: npm install swr
 */

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function UsageContributionsWithSWR() {
  const { data, error, isLoading } = useSWR('/api/activity', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 60000 // Refresh every minute
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error('Error loading activity:', error)
    return <UsageContributionsCard year={2025} />
  }

  // Transform data
  const usageDays = data?.grid?.flat().map(day => ({
    date: day.date,
    count: day.count
  })) || null

  return (
    <UsageContributionsCard 
      year={2025}
      data={usageDays}
    />
  )
}

/**
 * ALTERNATIVE: Server Component with Server-Side Fetching
 * 
 * For Next.js App Router server components
 */

import { createClient } from '@/lib/supabase/server'

export async function UsageContributionsServerComponent() {
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return <UsageContributionsCard year={new Date().getFullYear()} />
  }

  // Fetch activity data directly from database
  const currentYear = new Date().getFullYear()
  const from = new Date(currentYear, 0, 1) // Jan 1
  const to = new Date(currentYear, 11, 31) // Dec 31

  const { data: activityLogs, error } = await supabase
    .from('activity_logs')
    .select('activity_date, activity_count')
    .eq('user_id', user.id)
    .gte('activity_date', from.toISOString().split('T')[0])
    .lte('activity_date', to.toISOString().split('T')[0])
    .order('activity_date', { ascending: true })

  if (error) {
    console.error('Error fetching activity:', error)
    return <UsageContributionsCard year={currentYear} />
  }

  // Transform to expected format
  const usageDays = (activityLogs || []).map(log => ({
    date: log.activity_date,
    count: log.activity_count
  }))

  return (
    <UsageContributionsCard 
      year={currentYear}
      data={usageDays}
    />
  )
}

/**
 * TO USE IN PROFILE PAGE:
 * 
 * Replace the line:
 *   <UsageContributionsCard year={new Date().getFullYear()} />
 * 
 * With:
 *   <RealUsageContributionsExample />
 * 
 * Don't forget to import:
 *   import RealUsageContributionsExample from '@/components/usage-contributions/RealUsageContributionsExample'
 */
