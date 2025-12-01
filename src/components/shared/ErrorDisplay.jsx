"use client"

import { AlertCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Full-page error display with retry option
 */
export function ErrorDisplay({
  title = "Something went wrong",
  message = "An error occurred while loading this page.",
  onRetry,
  showRetry = true
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <XCircle className="h-12 w-12 text-destructive" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {message}
      </p>

      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

/**
 * Inline error alert (non-blocking)
 */
export function ErrorAlert({
  title = "Error",
  message,
  variant = "destructive",
  onDismiss
}) {
  return (
    <Alert variant={variant} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="ml-4"
          >
            Dismiss
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

/**
 * Warning alert for non-critical issues
 */
export function WarningAlert({ title = "Warning", message }) {
  return (
    <Alert variant="default" className="mb-4 border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-600 dark:text-yellow-400">{title}</AlertTitle>
      <AlertDescription className="text-yellow-600/90 dark:text-yellow-400/90">
        {message}
      </AlertDescription>
    </Alert>
  )
}

/**
 * Compact inline error message
 */
export function InlineError({ message }) {
  return (
    <div className="flex items-center gap-2 text-sm text-destructive py-2">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}
