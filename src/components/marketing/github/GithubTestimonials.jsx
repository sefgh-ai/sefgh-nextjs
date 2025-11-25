'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const testimonials = [
  { id: 'devs', label: 'Developers', quote: 'Sefgh helps me find the right repos faster than ever.', author: 'A. Dev' },
  { id: 'teams', label: 'Teams', quote: 'Our team curates tech stacks in minutes, not hours.', author: 'Team Lead' },
  { id: 'orgs', label: 'Enterprises', quote: 'Governed discovery with productivity built in.', author: 'Platform Eng' },
]

export default function GithubTestimonials() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0d1117] border-b border-[#21262d]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Loved by builders like you</h2>
        <Tabs defaultValue={testimonials[0].id} className="w-full">
          <TabsList className="grid grid-cols-3 bg-[#161b22] border border-[#30363d]">
            {testimonials.map(t => (
              <TabsTrigger key={t.id} value={t.id} className="text-white data-[state=active]:bg-[#238636]">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {testimonials.map(t => (
            <TabsContent key={t.id} value={t.id} className="mt-8">
              <blockquote className="text-[#c9d1d9] text-xl md:text-2xl leading-relaxed">“{t.quote}”</blockquote>
              <div className="mt-4 text-[#8b949e]">— {t.author}</div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
