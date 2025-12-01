"use client"

import { Button } from "@/components/ui/button"
import { 
  FileQuestion, 
  Search, 
  Database, 
  Inbox, 
  AlertCircle,
  FileX,
  Users,
  Settings
} from "lucide-react"

const icons = {
  search: Search,
  database: Database,
  inbox: Inbox,
  alert: AlertCircle,
  file: FileX,
  users: Users,
  settings: Settings,
  default: FileQuestion
}

/**
 * Reusable empty state component
 * Used across pages for consistent empty states
 */
export function EmptyState({
  icon = "default",
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  children,
  className = ""
}) {
  const Icon = icons[icon] || icons.default

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center px-4 ${className}`}>
      <div className="rounded-full bg-muted p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}

      {children}

      {(actionLabel && (onAction || actionHref)) && (
        <Button
          onClick={onAction}
          {...(actionHref && { asChild: true })}
          className="mt-4"
        >
          {actionHref ? (
            <a href={actionHref}>{actionLabel}</a>
          ) : (
            actionLabel
          )}
        </Button>
      )}
    </div>
  )
}

/**
 * Compact empty state for smaller sections
 */
export function CompactEmptyState({ icon = "inbox", message }) {
  const Icon = icons[icon] || icons.inbox

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="h-8 w-8 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
