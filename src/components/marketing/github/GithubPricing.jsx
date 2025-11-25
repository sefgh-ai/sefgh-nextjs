'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const plans = [
  { name: 'Free', price: '$0', features: ['Basic search', 'Public repos', 'Community support'] },
  { name: 'Pro', price: '$9', features: ['Advanced filters', 'Private insights', 'Priority support'] },
  { name: 'Team', price: '$29', features: ['Team workspaces', 'Shared collections', 'SAML SSO'] },
]

export default function GithubPricing() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0d1117] border-b border-[#21262d]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
        <p className="text-center text-[#8b949e] mb-12">Choose a plan that fits your team. Upgrade any time.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.name} className="border-[#30363d] bg-[#161b22]">
              <CardHeader>
                <CardTitle className="text-white flex items-baseline justify-between">
                  <span>{p.name}</span>
                  <span className="text-2xl">{p.price}<span className="text-sm text-[#8b949e]">/mo</span></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#8b949e] mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#238636]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-[#238636] hover:bg-[#2ea043]">Choose {p.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
