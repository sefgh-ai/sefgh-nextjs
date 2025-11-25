'use client'

import Link from 'next/link'

export default function GithubFooter() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-[#0d1117] border-t border-[#21262d]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
        <div className="text-[#8b949e]">© {new Date().getFullYear()} Sefgh. All rights reserved.</div>
        <div className="flex gap-6 text-[#8b949e]">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </div>
        <div className="justify-self-end text-[#8b949e]">
          <a href="https://github.com/sefgh-ai" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
