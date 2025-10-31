/**
 * Supabase Profiles Helper Functions
 * 
 * Use these functions throughout your app to interact with the profiles table
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Fetch a user's profile by ID
 */
export async function getUserProfile(userId) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Fetch all profiles (with optional limit)
 */
export async function getAllProfiles(limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(limit)

  if (error) {
    console.error('Error fetching profiles:', error)
    return []
  }

  return data
}

/**
 * Update current user's profile
 */
export async function updateProfile(userId, updates) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  return data
}

/**
 * Search profiles by name or email
 */
export async function searchProfiles(searchTerm) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching profiles:', error)
    return []
  }

  return data
}

/**
 * Subscribe to profile changes in real-time
 */
export function subscribeToProfile(userId, callback) {
  const supabase = createClient()
  
  const channel = supabase
    .channel(`profile:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}

/**
 * Unsubscribe from profile changes
 */
export async function unsubscribeFromProfile(channel) {
  const supabase = createClient()
  await supabase.removeChannel(channel)
}
