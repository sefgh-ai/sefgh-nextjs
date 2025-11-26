"use client"
import React, { useState } from "react"
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Search, Sparkles, Code, BookOpen, Zap, TrendingUp, GitBranch, Layers, Box, Settings } from "lucide-react"

export function AnimatedNavbar({ className }) {
  const [active, setActive] = useState(null)
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className={cn("w-auto", className)}>
      <Menu setActive={setActive}>
        {/* Platform MenuItem */}
        <MenuItem setActive={setActive} active={active} item="Platform">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/search">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Repository Search</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/chat">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>AI Code Assistant</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/playground">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>API Playground</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/trending">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Trending Projects</span>
              </div>
            </HoveredLink>
          </div>
        </MenuItem>

        {/* Solutions MenuItem */}
        <MenuItem setActive={setActive} active={active} item="Solutions">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="For Developers"
              href="/search"
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop"
              description="Discover code examples and best practices"
            />
            <ProductItem
              title="For Teams"
              href="/chat"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop"
              description="Collaborate and share repositories seamlessly"
            />
            <ProductItem
              title="For Startups"
              href="/submissions"
              src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop"
              description="Launch your project to the community"
            />
            <ProductItem
              title="For Enterprises"
              href="/playground"
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop"
              description="Scale your development workflow efficiently"
            />
          </div>
        </MenuItem>

        {/* Open Source MenuItem */}
        <MenuItem setActive={setActive} active={active} item="Open Source">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/trending">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" />
                <span>Trending Projects</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/submissions">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-400" />
                <span>Submit Your Project</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/search">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Explore Repositories</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/about">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Documentation</span>
              </div>
            </HoveredLink>
          </div>
        </MenuItem>

        {/* Features MenuItem */}
        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/search">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>GitHub Search</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/chat">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>AI Chat Assistant</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/playground">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>API Playground</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/trending">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Trending Repos</span>
              </div>
            </HoveredLink>
          </div>
        </MenuItem>

        {/* Resources MenuItem */}
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="AI-Powered Search"
              href="/search"
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"
              description="Find GitHub repositories with intelligent semantic search"
            />
            <ProductItem
              title="Code Assistant"
              href="/chat"
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
              description="Get instant help with your code through AI chat"
            />
            <ProductItem
              title="API Playground"
              href="/playground"
              src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop"
              description="Test and explore GitHub API endpoints interactively"
            />
            <ProductItem
              title="Trending Today"
              href="/trending"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
              description="Discover the hottest repositories on GitHub"
            />
          </div>
        </MenuItem>

        {/* Community MenuItem */}
        <MenuItem setActive={setActive} active={active} item="Community">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/submissions">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Submit Your Project</span>
              </div>
            </HoveredLink>
            <HoveredLink href="/about">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>About SEFGH</span>
              </div>
            </HoveredLink>
            {!user && (
              <HoveredLink href="/signup">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Join Community</span>
                </div>
              </HoveredLink>
            )}
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}
