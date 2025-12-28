'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Memoize supabase client to prevent recreation
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let initialLoad = true
    
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip refresh on initial load to avoid double refresh
      if (initialLoad && event === 'INITIAL_SESSION') {
        initialLoad = false
        return
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Only refresh on actual sign-in, not initial page load
        if (!initialLoad) {
          const { data: { session: freshSession }, error } = await supabase.auth.refreshSession()
          if (!error && freshSession) {
            console.log('🔄 Session refreshed on sign-in, avatar_url:', freshSession.user?.user_metadata?.avatar_url)
            setUser(freshSession.user)
          } else {
            setUser(session.user)
          }
        } else {
          setUser(session.user)
        }
        initialLoad = false
      } else if (event === 'USER_UPDATED' && session?.user) {
        // Handle user metadata updates
        setUser(session.user)
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const refreshUser = useCallback(async () => {
    try {
      // Force refresh session from server to get latest user metadata
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
        return
      }
      
      if (session?.user) {
        setUser(session.user)
        return session.user
      }
      
      return null
    } catch (error) {
      console.error('Error refreshing user:', error)
      return null
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }, [supabase, router])

  const value = useMemo(() => ({
    user,
    loading,
    refreshUser,
    signOut
  }), [user, loading, refreshUser, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  // Return safe defaults during SSR or when outside provider
  if (!context || Object.keys(context).length === 0) {
    return { 
      user: null, 
      loading: true, 
      refreshUser: async () => null, 
      signOut: async () => {} 
    }
  }
  return context
}
