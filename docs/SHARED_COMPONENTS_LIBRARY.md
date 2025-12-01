# Shared Components Library

## Overview
The shared components library provides reusable, consistent UI components across the SEFGH application. This reduces code duplication and ensures a uniform user experience.

## Location
All shared components are located in: `src/components/shared/`

## Import Usage
```javascript
// Import specific components
import { LoadingState, EmptyState, ErrorDisplay } from '@/components/shared'

// Or import everything
import * as Shared from '@/components/shared'
```

---

## Components

### 1. Loading States

#### **LoadingState**
Generic loading skeleton with multiple variants.

```javascript
import { LoadingState } from '@/components/shared'

// Card grid skeleton
<LoadingState type="card" count={6} />

// List skeleton
<LoadingState type="list" count={5} />

// Table skeleton
<LoadingState type="table" count={8} />

// Default skeleton
<LoadingState count={3} />
```

**Props:**
- `type`: `"card" | "list" | "table" | "default"` - Layout type
- `count`: `number` - Number of skeleton items (default: 1)

#### **PageLoadingState**
Full-page loading spinner with message.

```javascript
<PageLoadingState message="Loading repositories..." />
```

**Props:**
- `message`: `string` - Loading message (default: "Loading...")

#### **InlineLoadingState**
Compact spinner for inline use.

```javascript
<InlineLoadingState size="md" />
```

**Props:**
- `size`: `"sm" | "md" | "lg"` - Spinner size (default: "md")

---

### 2. Empty States

#### **EmptyState**
Full-featured empty state with icon, title, description, and action button.

```javascript
import { EmptyState } from '@/components/shared'

<EmptyState
  icon="search"
  title="No results found"
  description="Try adjusting your search filters"
  actionLabel="Clear Filters"
  onAction={handleClearFilters}
/>

// Or with href
<EmptyState
  icon="file"
  title="No submissions yet"
  description="Start by submitting your first repository"
  actionLabel="Submit Project"
  actionHref="/search"
/>
```

**Props:**
- `icon`: `string` - Icon name (see available icons below)
- `title`: `string` - Main heading
- `description`: `string` - Descriptive text
- `actionLabel`: `string` - Button text (optional)
- `onAction`: `() => void` - Click handler (optional)
- `actionHref`: `string` - Navigation link (optional)
- `children`: `React.ReactNode` - Custom content (optional)
- `className`: `string` - Additional CSS classes

**Available Icons:**
- `"search"` - Magnifying glass
- `"database"` - Database icon
- `"inbox"` - Inbox icon
- `"alert"` - Alert circle
- `"file"` - File X icon
- `"users"` - Users icon
- `"settings"` - Settings icon
- `"default"` - File question (fallback)

#### **CompactEmptyState**
Minimal empty state for smaller sections.

```javascript
<CompactEmptyState
  icon="inbox"
  message="No notifications yet"
/>
```

**Props:**
- `icon`: `string` - Icon name (same as EmptyState)
- `message`: `string` - Short message text

---

### 3. Error Displays

#### **ErrorDisplay**
Full-page error with retry option.

```javascript
import { ErrorDisplay } from '@/components/shared'

<ErrorDisplay
  title="Failed to load repositories"
  message="Please check your connection and try again"
  onRetry={handleRetry}
  showRetry={true}
/>
```

**Props:**
- `title`: `string` - Error heading (default: "Something went wrong")
- `message`: `string` - Error description
- `onRetry`: `() => void` - Retry handler (optional)
- `showRetry`: `boolean` - Show retry button (default: true)

#### **ErrorAlert**
Inline error alert (non-blocking).

```javascript
import { ErrorAlert } from '@/components/shared'

<ErrorAlert
  title="Error"
  message="Failed to save changes"
  onDismiss={handleDismiss}
/>
```

**Props:**
- `title`: `string` - Alert title (default: "Error")
- `message`: `string` - Alert message
- `variant`: `"destructive" | "default"` - Alert style
- `onDismiss`: `() => void` - Dismiss handler (optional)

#### **WarningAlert**
Warning alert for non-critical issues.

```javascript
import { WarningAlert } from '@/components/shared'

<WarningAlert
  title="Warning"
  message="This action cannot be undone"
/>
```

**Props:**
- `title`: `string` - Warning title (default: "Warning")
- `message`: `string` - Warning message

#### **InlineError**
Compact inline error message.

```javascript
import { InlineError } from '@/components/shared'

<InlineError message="Invalid email address" />
```

**Props:**
- `message`: `string` - Error message text

---

### 4. Layout Components

#### **PageHeader**
Standard page header with title, description, and optional back button.

```javascript
import { PageHeader } from '@/components/shared'

<PageHeader
  title="Repository Details"
  description="View and manage repository information"
  showBack={true}
  backHref="/search"
  action={<Button>Edit</Button>}
/>
```

**Props:**
- `title`: `string` - Page title
- `description`: `string` - Page description (optional)
- `showBack`: `boolean` - Show back button (default: false)
- `backHref`: `string` - Back navigation path (optional)
- `action`: `React.ReactNode` - Action button(s) (optional)
- `children`: `React.ReactNode` - Additional content (optional)

#### **Section**
Section with title and optional action button.

```javascript
import { Section } from '@/components/shared'

<Section
  title="Recent Activity"
  description="Your recent contributions"
  action={<Button variant="outline">View All</Button>}
>
  {/* Section content */}
</Section>
```

**Props:**
- `title`: `string` - Section title (optional)
- `description`: `string` - Section description (optional)
- `action`: `React.ReactNode` - Action button (optional)
- `children`: `React.ReactNode` - Section content
- `className`: `string` - Additional CSS classes

#### **Container**
Container with max width and padding.

```javascript
import { Container } from '@/components/shared'

<Container maxWidth="7xl">
  {/* Page content */}
</Container>
```

**Props:**
- `maxWidth`: `"sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full"` - Max width (default: "7xl")
- `children`: `React.ReactNode` - Container content
- `className`: `string` - Additional CSS classes

#### **TwoColumnLayout**
Two-column layout with sidebar.

```javascript
import { TwoColumnLayout } from '@/components/shared'

<TwoColumnLayout
  sidebar={<Sidebar />}
  sidebarPosition="left"
>
  {/* Main content */}
</TwoColumnLayout>
```

**Props:**
- `sidebar`: `React.ReactNode` - Sidebar content
- `sidebarPosition`: `"left" | "right"` - Sidebar position (default: "left")
- `children`: `React.ReactNode` - Main content

---

### 5. Card Components

#### **RepoCard**
Repository card with consistent styling.

```javascript
import { RepoCard } from '@/components/shared'

<RepoCard
  name="nextjs"
  owner="vercel"
  description="The React Framework"
  stars={125000}
  forks={27000}
  language="TypeScript"
  topics={["react", "nextjs", "framework"]}
  href="https://github.com/vercel/next.js"
/>
```

**Props:**
- `name`: `string` - Repository name
- `description`: `string` - Repository description (optional)
- `stars`: `number` - Star count (optional)
- `forks`: `number` - Fork count (optional)
- `language`: `string` - Primary language (optional)
- `topics`: `string[]` - Topic tags (optional)
- `href`: `string` - Repository link (optional)
- `owner`: `string` - Repository owner (optional)

#### **StatCard**
Metric display card.

```javascript
import { StatCard } from '@/components/shared'
import { Users } from 'lucide-react'

<StatCard
  title="Total Users"
  value="1,234"
  description="Active this month"
  icon={Users}
  trend={12.5}
/>
```

**Props:**
- `title`: `string` - Stat title
- `value`: `string | number` - Stat value
- `description`: `string` - Description text (optional)
- `icon`: `LucideIcon` - Icon component (optional)
- `trend`: `number` - Percentage change (optional)

#### **FeatureCard**
Feature card with icon.

```javascript
import { FeatureCard } from '@/components/shared'
import { Zap } from 'lucide-react'

<FeatureCard
  icon={Zap}
  title="Fast Performance"
  description="Optimized for speed and efficiency"
  action={<Button>Learn More</Button>}
/>
```

**Props:**
- `icon`: `LucideIcon` - Icon component (optional)
- `title`: `string` - Feature title
- `description`: `string` - Feature description (optional)
- `action`: `React.ReactNode` - Action button (optional)

#### **InfoCard**
Info card with custom styling variants.

```javascript
import { InfoCard } from '@/components/shared'

<InfoCard
  title="Important Notice"
  variant="info"
  footer={<Button>Acknowledge</Button>}
>
  <p>Your API key will expire in 7 days.</p>
</InfoCard>
```

**Props:**
- `title`: `string` - Card title (optional)
- `variant`: `"default" | "info" | "success" | "warning" | "danger"` - Style variant
- `children`: `React.ReactNode` - Card content
- `footer`: `React.ReactNode` - Footer content (optional)

---

## Migration Examples

### Before (Custom Component)
```javascript
// Old SubmissionsLoadingSkeleton.jsx
const SubmissionsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-card/50 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}
```

### After (Shared Component)
```javascript
// New SubmissionsLoadingSkeleton.jsx
import { LoadingState } from '@/components/shared'

const SubmissionsLoadingSkeleton = () => {
  return <LoadingState type="card" count={6} />
}
```

**Result:** 12 lines → 3 lines (75% reduction)

---

## Benefits

### 1. **Consistency**
All loading states, empty states, and errors look and behave the same across the app.

### 2. **Maintainability**
Update one component to fix/improve behavior everywhere it's used.

### 3. **Code Reduction**
Typical savings: 60-80% fewer lines of code.

### 4. **Developer Experience**
Simple imports, clear API, comprehensive documentation.

### 5. **Performance**
Memoized components prevent unnecessary re-renders.

### 6. **Accessibility**
Shared components follow accessibility best practices.

---

## Usage Statistics

### Pages Updated (Phase 5)
- ✅ Submissions page (3 components)
- ✅ Search page (2 components)
- ✅ Profile page (layout components)
- 🔄 More pages to follow...

### Code Savings
- **Before:** ~150 lines of duplicated loading/empty states
- **After:** ~30 lines using shared components
- **Reduction:** 80% fewer lines

---

## Best Practices

### 1. **Always Use Shared Components First**
Before creating a custom loading/empty state, check if a shared component fits.

### 2. **Extend, Don't Duplicate**
If you need custom behavior, wrap the shared component:
```javascript
function CustomEmptyState({ customProp }) {
  return (
    <EmptyState
      icon="search"
      title="Custom Title"
      description={customProp}
    >
      <CustomContent />
    </EmptyState>
  )
}
```

### 3. **Use Consistent Icons**
Stick to the predefined icon set for consistency.

### 4. **Provide Context**
Use descriptive messages that help users understand the state.

### 5. **Add Actions When Helpful**
Include action buttons to guide users to the next step.

---

## Future Enhancements

### Planned Features
- [ ] Toast notification component
- [ ] Modal/dialog components
- [ ] Form field components
- [ ] Table components
- [ ] Pagination component
- [ ] Breadcrumb component
- [ ] Badge/tag components
- [ ] Progress indicators

### Potential Improvements
- [ ] Animation variants (fade, slide, etc.)
- [ ] Dark/light mode variants
- [ ] Size variants (compact, normal, large)
- [ ] Custom icon upload support
- [ ] Internationalization support

---

## Support

For questions or issues with shared components:
1. Check this documentation
2. Review component source code in `src/components/shared/`
3. Check usage examples in existing pages
4. Create an issue with [Shared Component] prefix

---

## Changelog

### v1.0.0 (Phase 5 - December 2025)
- Initial release
- LoadingState, EmptyState, ErrorDisplay components
- PageLayout components (Header, Section, Container)
- Card components (RepoCard, StatCard, FeatureCard, InfoCard)
- Comprehensive documentation
- Migration of 3 major pages

---

**Last Updated:** December 1, 2025  
**Maintained By:** SEFGH Development Team
