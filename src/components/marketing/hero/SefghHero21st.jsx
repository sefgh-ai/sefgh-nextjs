'use client'

import { Button } from "@/components/ui/button"
import ProCard from "@/components/ui/ProCard"

export default function SefghHero21st() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-28">
      {/* soft radial background keeping 3D visible */}
      <div className="bg-hero-radial" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Search smarter. Code better.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#8b949e] max-w-xl leading-relaxed">
            SEFGH brings intelligence to GitHub search — delivering the most relevant repositories, code snippets, commits, and discussions instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="px-6 py-5 text-base bg-[#238636] hover:bg-[#2ea043] rounded-xl">Try SEFGH Now →</Button>
            <Button variant="outline" className="px-6 py-5 text-base rounded-xl border-[#30363d] text-white hover:bg-[#21262d]">Learn How It Works</Button>
          </div>

          <div className="mt-6 text-[#8b949e] text-sm">
            Powered by AI. Built by developers, for developers.
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { k: '1.5x', v: 'faster search' },
              { k: 'AI', v: 'understood queries' },
              { k: '100k+', v: 'repos indexed' },
            ].map(({ k, v }) => (
              <ProCard key={k} className="p-4 text-center rounded-2xl">
                <div className="text-2xl font-bold text-white">{k}</div>
                <div className="text-xs text-[#8b949e] mt-1">{v}</div>
              </ProCard>
            ))}
          </div>
        </div>

        {/* Right: visual placeholder (keeps 3D intact) */}
        <div className="relative">
          <ProCard className="h-[320px] rounded-2xl flex items-center justify-center text-[#8b949e]">
            Search UI preview
          </ProCard>
        </div>
      </div>
    </section>
  )
}
