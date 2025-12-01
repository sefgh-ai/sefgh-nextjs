'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Custom hook for managing profile data
 * @param {Object} user - Current user from auth context
 * @param {Function} refreshUser - Function to refresh user data
 * @returns {Object} Profile data and update functions
 */
export const useProfileData = (user, refreshUser) => {
  const supabase = createClient()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    website: '',
    avatarUrl: ''
  })

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
        setFormData({
          fullName: data.full_name || '',
          email: data.email || '',
          bio: data.bio || '',
          website: data.website || '',
          avatarUrl: data.avatar_url || ''
        })
      }
    }

    fetchProfile()
  }, [user, supabase])

  // Update avatar URL when user changes
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setFormData(prev => ({
        ...prev,
        avatarUrl: user.user_metadata.avatar_url
      }))
    }
  }, [user])

  /**
   * Update profile data in Supabase
   * @param {Object} updates - Fields to update
   */
  const updateProfile = async (updates) => {
    setLoading(true)

    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
        }
      })

      if (authError) throw authError

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: updates.bio,
          website: updates.website,
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Refresh user data
      await refreshUser()

      toast.success("Profile updated! ✨", {
        description: "Your profile information has been saved successfully.",
        duration: 3000,
      })

      return true
    } catch (error) {
      toast.error("Update failed", {
        description: error.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update form data state
   * @param {string} field - Field name to update
   * @param {*} value - New value
   */
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Handle avatar upload success
   * @param {string} newAvatarUrl - New avatar URL
   */
  const handleAvatarUpload = (newAvatarUrl) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: newAvatarUrl
    }))
  }

  return {
    profile,
    formData,
    loading,
    updateProfile,
    updateFormData,
    handleAvatarUpload
  }
}
