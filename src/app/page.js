'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import { useTheme } from "next-themes";
import { Search, Sparkles, Code, Gem, Brain, Twitter, Sun, Moon, User, Home as HomeIcon } from "lucide-react";

// Dynamically import SocialProof (ensure correct default export resolution and no SSR)
const SocialProof = dynamic(() => import("@/components/marketing/SocialProof").then(m => m.default), { ssr: false });

// Dynamically import ParticleText with no SSR (canvas needs browser)
const ParticleText = dynamic(
  () => import("@/components/ui/particle-text-canvas"),
  { ssr: false }
);

// Dynamically import Three.js background with no SSR (Three.js needs browser)
const ThreeBackground = dynamic(
  () => import("@/components/3d/ThreeBackground"),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const { t, messages, locale, changeLanguage, languages } = useLanguage();
  const { user } = useAuth();
  const [searchPlaceholder, setSearchPlaceholder] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [allowMotion, setAllowMotion] = useState(true);
  const reducedMotionQuery = useRef(null);

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      reducedMotionQuery.current = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = () => setAllowMotion(!reducedMotionQuery.current.matches);
      onChange();
      reducedMotionQuery.current.addEventListener?.('change', onChange);
      return () => reducedMotionQuery.current?.removeEventListener?.('change', onChange);
    }
  }, []);

  // Rotate search placeholders
  useEffect(() => {
    if (!messages) return;
    const interval = setInterval(() => {
      setSearchPlaceholder((prev) => (prev + 1) % messages.hero.searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages]);

  if (!messages || !mounted) {
    return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-[#58a6ff]">Loading...</div>
    </div>;
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1117]">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-black/80 text-white px-4 py-2 rounded">
        Skip to content
      </a>
      {/* Three.js 3D Background */}
      {mounted && allowMotion && <ThreeBackground />}

      {/* Header */}
      <header className="relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {mounted && <ParticleText text={t('header.logo')} />}
            <span className="px-2.5 py-1 bg-[#161b22] border border-[#30363d] rounded-md text-[#8b949e] text-xs font-medium">
              v2.8.5
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Language Selector (Dropdown) */}
            <LanguageDropdown />
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-[#30363d] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            
            {/* Show Profile or Sign Up based on auth status */}
            {user ? (
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white rounded-md transition-colors"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={getUserDisplayName()}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#238636] flex items-center justify-center text-white text-xs font-semibold">
                    {getUserInitials()}
                  </div>
                )}
                <span className="font-medium">{getUserDisplayName()}</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/signup')}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors"
              >
                Sign up
              </button>
            )}
          </div>
        </div>
      </header>

  {/* Hero Section */}
  <section id="main-content" className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-[#8b949e] max-w-3xl mx-auto mb-12">
            {t('hero.subtitle')}
          </p>
          
          {/* Search Box */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <input
                type="text"
                placeholder={messages.hero.searchPlaceholders[searchPlaceholder]}
                className="w-full pl-12 pr-4 py-4 bg-[#161b22] border border-[#30363d] rounded-lg text-white placeholder-[#8b949e] focus:border-[#58a6ff] focus:outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Action Buttons - Conditional based on auth status */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {!user ? (
              /* Not logged in: Show large centered signup button */
              <button
                onClick={() => router.push('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#238636] text-white text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-[#238636]/50 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 inline-block mr-2" />
                Get Started - Sign Up Free
              </button>
            ) : (
              /* Logged in: Show Home and Explore Search buttons */
              <>
                <button
                  onClick={() => router.push('/home')}
                  className="px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-white font-medium rounded-md border border-[#30363d] transition-colors"
                >
                  <HomeIcon className="w-4 h-4 inline-block mr-2" />
                  Home
                </button>
                <button
                  onClick={() => router.push('/search')}
                  className="px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-white font-medium rounded-md border border-[#30363d] transition-colors"
                >
                  <Search className="w-4 h-4 inline-block mr-2" />
                  Explore Search
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 border-t border-[#21262d]">
        <div className="max-w-6xl mx-auto">
          <SocialProof />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-[#21262d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {messages.features.items.map((feature, index) => {
              const icons = [Brain, Gem, Code];
              const Icon = icons[index];
              return (
                <div key={index} className="p-6 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#58a6ff] transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-[#238636] flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#8b949e] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-[#21262d]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-16">
            {t('howItWorks.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {messages.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#238636] text-white text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-[#8b949e] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-32 border-t border-[#21262d]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-[#8b949e] mb-10">
            {t('cta.subtitle')}
          </p>
          {!user && (
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 bg-[#238636] hover:bg-[#2ea043] text-white text-lg font-semibold rounded-lg transition-colors"
            >
              Sign up free
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-4 sm:px-6 lg:px-8 py-12 border-t border-[#21262d]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[#8b949e] text-sm">
              {t('footer.copyright')}
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors text-sm">
                {t('footer.links.about')}
              </Link>
              <Link href="/privacy" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors text-sm">
                {t('footer.links.privacy')}
              </Link>
              <Link href="/terms" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors text-sm">
                {t('footer.links.terms')}
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://twitter.com/sefghai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                aria-label={t('footer.social.twitter')}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/sefgh-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                aria-label={t('footer.social.github')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
