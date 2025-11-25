"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { needsOnboarding, skipOnboarding } from '@/lib/supabase/onboarding'
import { X, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingBanner() {
  const { user } = useAuth()
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkOnboarding() {
      if (user?.id) {
        const requiresOnboarding = await needsOnboarding(user.id)
        setShowBanner(requiresOnboarding)
      }
      setIsLoading(false)
    }

    checkOnboarding()
  }, [user])

  const handleDismiss = async () => {
    setShowBanner(false)
    if (user?.id) {
      await skipOnboarding(user.id)
    }
  }

  if (isLoading || !showBanner) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 p-6 mb-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Help us personalize your experience! Tell us about your role, tech stack, and goals to get tailored repository recommendations and features.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Sparkles className="w-4 h-4" />
                Complete Profile
              </Link>
              
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all border border-white/10"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
    </div>
  )
}
