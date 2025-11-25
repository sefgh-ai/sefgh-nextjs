'use client'

import GithubHero from "@/components/marketing/github/GithubHero"
import GithubPricing from "@/components/marketing/github/GithubPricing"
import GithubTestimonials from "@/components/marketing/github/GithubTestimonials"
import GithubAddonsGrid from "@/components/marketing/github/GithubAddonsGrid"
import GithubFeaturesCollab from "@/components/marketing/github/GithubFeaturesCollab"
import GithubFeaturesAI from "@/components/marketing/github/GithubFeaturesAI"
import GithubFooter from "@/components/marketing/github/GithubFooter"
import LanguageDropdown from "@/components/LanguageDropdown"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export default function GithubScreensPage() {
  const { theme, setTheme } = useTheme()
  return (
    <main className="min-h-screen bg-[#0d1117]">
      {/* Lightweight header without 3D (keep project 3D untouched) */}
      <header className="sticky top-0 z-10 border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-semibold">Sefgh Screens • GitHub</Link>
          <div className="flex items-center gap-3">
            <LanguageDropdown />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-[#30363d] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </div>
      </header>

      <GithubHero />
      <GithubFeaturesCollab />
      <GithubFeaturesAI />
      <GithubPricing />
      <GithubAddonsGrid />
      <GithubTestimonials />
      <GithubFooter />
    </main>
  )
}
