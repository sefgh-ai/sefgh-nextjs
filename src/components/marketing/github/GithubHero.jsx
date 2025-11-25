'use client'

import { Button } from "@/components/ui/button"

export default function GithubHero() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-[#0d1117] border-b border-[#21262d]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Sefgh Developer Platform
          </h1>
          <p className="mt-6 text-lg text-[#8b949e]">
            Build, collaborate, and ship faster with Sefgh. A familiar GitHub-inspired experience tailored to our product.
          </p>
          <div className="mt-8 flex gap-3">
            <Button className="bg-[#238636] hover:bg-[#2ea043]">Get started</Button>
            <Button variant="outline" className="border-[#30363d] text-white hover:bg-[#21262d]">Learn more</Button>
          </div>
        </div>
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] min-h-[240px] flex items-center justify-center text-[#8b949e]">
          UI Preview Placeholder
        </div>
      </div>
    </section>
  )
}
