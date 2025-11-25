import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { needsOnboarding, getOnboardingData } from '@/lib/supabase/onboarding'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/search'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user needs onboarding
        const requiresOnboarding = await needsOnboarding(user.id)
        
        if (requiresOnboarding) {
          // Get current step if user has partial progress
          const onboardingData = await getOnboardingData(user.id)
          const currentStep = onboardingData?.current_step || 1
          
          // Redirect to onboarding with current step
          return NextResponse.redirect(`${origin}/onboarding?step=${currentStep}`)
        }
      }
      
      // User doesn't need onboarding, redirect to next page
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
}
