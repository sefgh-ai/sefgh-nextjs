'use client'

import { Brain, Sparkles, Search } from 'lucide-react'

const items = [
  { icon: Search, title: 'Semantic search', desc: 'Find repos by intent, not just keywords.' },
  { icon: Brain, title: 'AI insights', desc: 'Summaries and signals to assess quality fast.' },
  { icon: Sparkles, title: 'Smart curation', desc: 'Auto-group related projects into collections.' },
]

export default function GithubFeaturesAI() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0d1117] border-b border-[#21262d]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI-powered</h2>
        <p className="text-[#8b949e] mb-10">Boost discovery with built-in intelligence.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-lg border border-[#30363d] bg-[#161b22]">
              <div className="h-10 w-10 rounded-md bg-[#238636] flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <p className="text-[#8b949e] mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
