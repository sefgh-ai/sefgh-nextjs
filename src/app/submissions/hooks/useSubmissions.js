'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Custom hook for managing user submissions
 * @param {Object} user - Current authenticated user
 * @returns {Object} Submissions data and handlers
 */
export const useSubmissions = (user) => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchSubmissions()
    }
  }, [user])

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
    setSubmissions(prev => prev.filter(s => s.id !== submissionId))
    toast.success("Submission removed from view")
  }

  return {
    submissions,
    loading,
    handleDelete,
    refetch: fetchSubmissions
  }
}
