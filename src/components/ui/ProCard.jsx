'use client'

import { cn } from "@/lib/utils"

export default function ProCard({ className, children, glow = true, ...props }) {
  return (
    <div
      className={cn('card-21', glow && 'with-glow', className)}
      {...props}
    >
      {children}
    </div>
  )
}
