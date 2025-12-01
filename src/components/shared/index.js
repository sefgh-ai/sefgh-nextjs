/**
 * Shared Component Library
 * Centralized exports for reusable components across the application
 */

// Loading States
export {
  LoadingState,
  PageLoadingState,
  InlineLoadingState
} from "./LoadingState"

// Legacy loading components (keep for backward compatibility)
export { LoadingSpinner, PageLoadingSpinner } from "./LoadingSpinner"

// Empty States
export {
  EmptyState,
  CompactEmptyState
} from "./EmptyState"

// Error Displays
export {
  ErrorDisplay,
  ErrorAlert,
  WarningAlert,
  InlineError
} from "./ErrorDisplay"

// Layout Components
export {
  PageHeader,
  Section,
  Container,
  TwoColumnLayout
} from "./PageLayout"

// Card Components
export {
  RepoCard,
  StatCard,
  FeatureCard,
  InfoCard
} from "./CardComponents"

// Dialogs
export { ConfirmDialog } from "./ConfirmDialog"

// Error Boundary
export { default as ErrorBoundary } from "./ErrorBoundary"
