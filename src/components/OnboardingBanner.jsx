"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { X, Sparkles } from "lucide-react";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import {
  getOnboardingData,
  createOnboardingData,
} from "@/lib/supabase/onboarding";

export default function OnboardingBanner() {
  const { user } = useAuth();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side and when user is available
    if (!user?.id) {
      console.log("[OnboardingBanner] No user, skipping check");
      setIsLoading(false);
      return;
    }

    console.log("[OnboardingBanner] Checking for user:", user.id);

    // Check sessionStorage for current session dismissal only
    const dismissedThisSession = sessionStorage.getItem(
      `onboarding_dismissed_session_${user.id}`
    );
    if (dismissedThisSession) {
      console.log("[OnboardingBanner] Dismissed this session");
      setShowBanner(false);
      setIsLoading(false);
      return;
    }

    // Clear any old localStorage dismissal (legacy cleanup)
    localStorage.removeItem(`onboarding_dismissed_${user.id}`);

    // Lazy load the DB check only when needed
    const checkOnboarding = async () => {
      try {
        const { needsOnboarding } = await import("@/lib/supabase/onboarding");
        console.log("[OnboardingBanner] Checking needsOnboarding...");
        const requiresOnboarding = await needsOnboarding(user.id);
        console.log(
          "[OnboardingBanner] needsOnboarding result:",
          requiresOnboarding
        );
        setShowBanner(requiresOnboarding);

        // Pre-fetch onboarding data for the modal
        if (requiresOnboarding) {
          let data = await getOnboardingData(user.id);
          if (!data) {
            data = await createOnboardingData(user.id);
          }
          setOnboardingData(data);
        }
      } catch (error) {
        // Silently fail - don't block rendering
        console.error("Onboarding check failed:", error);
        setShowBanner(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [user?.id]);

  const handleDismiss = async () => {
    setShowBanner(false);
    if (user?.id) {
      // Save to sessionStorage - only dismissed for this session
      // Will show again on next visit
      sessionStorage.setItem(`onboarding_dismissed_session_${user.id}`, "true");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleComplete = () => {
    setShowModal(false);
    setShowBanner(false);
    // Refresh the page to reflect the completed onboarding
    router.refresh();
  };

  const handleSkip = () => {
    setShowModal(false);
    setShowBanner(false);
    if (user?.id) {
      // Only dismiss for current session - will show again next visit
      sessionStorage.setItem(`onboarding_dismissed_session_${user.id}`, "true");
    }
  };

  if (isLoading || !showBanner) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 p-4 sm:p-6 mb-6">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />

        <div className="relative flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                Complete Your Profile
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                Help us personalize your experience! Tell us about your role,
                tech stack, and goals to get tailored recommendations.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Complete Profile
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs sm:text-sm font-medium transition-all border border-white/10"
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
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
      </div>

      {/* Onboarding Modal */}
      {showModal && user?.id && (
        <OnboardingModal
          userId={user.id}
          initialStep={onboardingData?.current_step || 1}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  );
}
