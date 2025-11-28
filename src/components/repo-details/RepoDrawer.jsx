'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CodeExplorer } from '@/components/CodeExplorer'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RepoDrawer({ open, onOpenChange, repository }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl lg:max-w-4xl p-0 border-l border-white/10"
      >
        <div className="h-full flex flex-col bg-card">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">
                Repository Canvas
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <CodeExplorer
              repository={repository}
              onClose={() => onOpenChange(false)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
