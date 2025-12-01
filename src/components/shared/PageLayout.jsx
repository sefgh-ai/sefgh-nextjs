"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { memo, useCallback } from "react"

/**
 * Standard page header with title, description, and optional back button
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.description] - Page description
 * @param {boolean} [props.showBack=false] - Show back button
 * @param {string} [props.backHref] - Back navigation path (uses router.back() if not provided)
 * @param {React.ReactNode} [props.action] - Action button or element
 * @param {React.ReactNode} [props.children] - Additional content
 * @returns {JSX.Element}
 */
export const PageHeader = memo(function PageHeader({ 
  title, 
  description, 
  showBack = false, 
  backHref,
  action,
  children 
}) {
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }, [backHref, router])

  return (
    <div className="mb-8">
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>
        
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {children}
    </div>
  )
})

/**
 * Section with title and optional action button
 * @param {Object} props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {React.ReactNode} [props.action] - Action button or element
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.className=""] - Additional CSS classes
 * @returns {JSX.Element}
 */
export const Section = memo(function Section({ title, description, action, children, className = "" }) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
})

/**
 * Container with max width and padding
 * @param {Object} props
 * @param {React.ReactNode} props.children - Container content
 * @param {"sm"|"md"|"lg"|"xl"|"2xl"|"7xl"|"full"} [props.maxWidth="7xl"] - Maximum width
 * @param {string} [props.className=""] - Additional CSS classes
 * @returns {JSX.Element}
 */
export const Container = memo(function Container({ children, maxWidth = "7xl", className = "" }) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full"
  }

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
})

/**
 * Two-column layout (sidebar + main content)
 * @param {Object} props
 * @param {React.ReactNode} props.sidebar - Sidebar content
 * @param {React.ReactNode} props.children - Main content
 * @param {"left"|"right"} [props.sidebarPosition="left"] - Sidebar position
 * @returns {JSX.Element}
 */
export const TwoColumnLayout = memo(function TwoColumnLayout({ sidebar, children, sidebarPosition = "left" }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {sidebarPosition === "left" && (
        <aside className="lg:col-span-3">{sidebar}</aside>
      )}
      
      <main className={sidebarPosition === "left" ? "lg:col-span-9" : "lg:col-span-9"}>
        {children}
      </main>
      
      {sidebarPosition === "right" && (
        <aside className="lg:col-span-3">{sidebar}</aside>
      )}
    </div>
  )
})
