'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const addons = [
  { name: 'Insights', desc: 'Deeper repo analytics and trends.' },
  { name: 'Compliance', desc: 'Policy checks and governance.' },
  { name: 'AI Assist', desc: 'Smarter search, summaries, and curation.' },
  { name: 'Integrations', desc: 'Connect with your favorite tools.' },
]

export default function GithubAddonsGrid() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0d1117] border-b border-[#21262d]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Add-ons</h2>
        <p className="text-[#8b949e] mb-10">Enhance your workflow with optional capabilities.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {addons.map(a => (
            <Card key={a.name} className="border-[#30363d] bg-[#161b22] h-full">
              <CardHeader>
                <CardTitle className="text-white">{a.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-[#8b949e]">{a.desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
