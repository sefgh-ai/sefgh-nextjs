'use client'

import { Button } from "@/components/ui/button"
import { CodeBracketIcon } from "@heroicons/react/24/outline"
import { Header } from "@/components/Header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SubmitProjectDialog } from "@/components/SubmitProjectDialog"

export function SearchNavbar() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 gap-4">
        <SidebarTrigger className="hover:bg-white/10 rounded-xl transition-smooth" />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <SubmitProjectDialog>
            <Button 
              variant="outline" 
              className="glass-premium border border-white/10 rounded-xl hover:glow-border-blue transition-smooth shadow-soft hover:shadow-soft-lg"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </SubmitProjectDialog>
          <Header />
        </div>
      </div>
    </div>
  )
}
