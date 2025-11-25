'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { 
  getOnboardingData, 
  createOnboardingData 
} from '@/lib/supabase/onboarding'
import { Loader2, AlertCircle, Database, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [onboardingData, setOnboardingData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function initOnboarding() {
      if (authLoading) return
      
      if (!user) {
        router.push('/login')
        return
      }

      try {
        // Check if onboarding data exists
        let data = await getOnboardingData(user.id)
        
        // If no data, create initial record
        if (!data) {
          data = await createOnboardingData(user.id)
        }
        
        // If already completed, redirect to home
        if (data.completed) {
          router.push('/home')
          return
        }

        setOnboardingData(data)
        setError(null)
      } catch (error) {
        console.error('Error initializing onboarding:', error)
        
        // Check if it's a database setup error
        if (error.message?.includes('does not exist') || error.message?.includes('table')) {
          setError('database_setup')
        } else {
          setError('general')
        }
      } finally {
        setLoading(false)
      }
    }

    initOnboarding()
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#58a6ff]" />
      </div>
    )
  }

  // Show database setup error
  if (error === 'database_setup') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full glass-premium border-[#30363d]">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Database className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Database Setup Required</CardTitle>
                <CardDescription className="text-[#8b949e]">
                  The onboarding table needs to be created in Supabase
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Quick Setup Steps:
              </h3>
              <ol className="space-y-2 text-sm text-[#8b949e]">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#238636] text-white flex items-center justify-center text-xs font-semibold">1</span>
                  <span>Open your <strong className="text-white">Supabase Dashboard</strong> → SQL Editor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#238636] text-white flex items-center justify-center text-xs font-semibold">2</span>
                  <span>Copy all contents from <code className="px-1.5 py-0.5 bg-[#0d1117] rounded text-[#58a6ff] font-mono text-xs">supabase/onboarding-schema.sql</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#238636] text-white flex items-center justify-center text-xs font-semibold">3</span>
                  <span>Paste and run the SQL in the editor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#238636] text-white flex items-center justify-center text-xs font-semibold">4</span>
                  <span>Refresh this page</span>
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                I've Run the Migration - Refresh
              </Button>
              <Button
                onClick={() => router.push('/home')}
                variant="outline"
                className="flex-1 border-[#30363d] hover:bg-[#21262d] text-[#8b949e] hover:text-white"
              >
                Skip for Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-[#8b949e] text-center">
              See <code className="px-1.5 py-0.5 bg-[#21262d] rounded text-[#58a6ff] font-mono">ONBOARDING_SETUP.md</code> for detailed instructions
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show general error
  if (error === 'general') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass-premium border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Something went wrong
            </CardTitle>
            <CardDescription className="text-[#8b949e]">
              We couldn't initialize your onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/home')}
              variant="outline"
              className="w-full border-[#30363d] hover:bg-[#21262d] text-[#8b949e] hover:text-white"
            >
              Continue to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !onboardingData) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <OnboardingModal 
        userId={user.id}
        initialStep={onboardingData.current_step}
        onComplete={() => router.push('/home')}
        onSkip={() => router.push('/home')}
      />
    </div>
  )
}
