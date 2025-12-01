# Shared Components - Quick Reference

## Import Syntax
```javascript
import { 
  LoadingState, 
  PageLoadingState,
  EmptyState,
  ErrorDisplay,
  PageHeader,
  RepoCard 
} from '@/components/shared'
```

---

## Loading States

### LoadingState
```javascript
<LoadingState type="card" count={6} />
<LoadingState type="list" count={5} />
<LoadingState type="table" count={8} />
<LoadingState count={3} />
```

### PageLoadingState
```javascript
<PageLoadingState message="Loading repositories..." />
```

### InlineLoadingState
```javascript
<InlineLoadingState size="sm" />
<InlineLoadingState size="md" />
<InlineLoadingState size="lg" />
```

---

## Empty States

### EmptyState
```javascript
<EmptyState
  icon="search"
  title="No results found"
  description="Try different keywords"
  actionLabel="Clear Search"
  onAction={handleClear}
/>
```

**Icons:** search, database, inbox, alert, file, users, settings, default

### CompactEmptyState
```javascript
<CompactEmptyState
  icon="inbox"
  message="No notifications yet"
/>
```

---

## Error Displays

### ErrorDisplay
```javascript
<ErrorDisplay
  title="Failed to load"
  message="Check your connection"
  onRetry={handleRetry}
/>
```

### ErrorAlert
```javascript
<ErrorAlert
  title="Validation Error"
  message="Email is required"
  onDismiss={handleDismiss}
/>
```

### WarningAlert
```javascript
<WarningAlert
  title="Warning"
  message="This action cannot be undone"
/>
```

### InlineError
```javascript
<InlineError message="Invalid email" />
```

---

## Layout Components

### PageHeader
```javascript
<PageHeader
  title="Settings"
  description="Manage your account"
  showBack={true}
  action={<Button>Save</Button>}
/>
```

### Section
```javascript
<Section
  title="Recent Activity"
  description="Your latest contributions"
  action={<Button>View All</Button>}
>
  <ActivityList />
</Section>
```

### Container
```javascript
<Container maxWidth="7xl">
  <PageContent />
</Container>
```

**Sizes:** sm, md, lg, xl, 2xl, 7xl, full

### TwoColumnLayout
```javascript
<TwoColumnLayout
  sidebar={<Sidebar />}
  sidebarPosition="left"
>
  <MainContent />
</TwoColumnLayout>
```

---

## Card Components

### RepoCard
```javascript
<RepoCard
  name="nextjs"
  owner="vercel"
  description="The React Framework"
  stars={125000}
  forks={27000}
  language="TypeScript"
  topics={["react", "nextjs"]}
  href="https://github.com/vercel/next.js"
/>
```

### StatCard
```javascript
<StatCard
  title="Total Users"
  value="1,234"
  description="Active this month"
  icon={Users}
  trend={12.5}
/>
```

### FeatureCard
```javascript
<FeatureCard
  icon={Zap}
  title="Fast Performance"
  description="Optimized for speed"
  action={<Button>Learn More</Button>}
/>
```

### InfoCard
```javascript
<InfoCard
  title="Important Notice"
  variant="info"
  footer={<Button>Acknowledge</Button>}
>
  <p>Your API key expires in 7 days.</p>
</InfoCard>
```

**Variants:** default, info, success, warning, danger

---

## Common Patterns

### Loading → Empty → Content
```javascript
function MyComponent({ data, loading }) {
  if (loading) return <LoadingState type="card" count={6} />
  if (!data || data.length === 0) {
    return <EmptyState icon="search" title="No data" />
  }
  return <DataList data={data} />
}
```

### Error Handling
```javascript
function MyComponent({ error, onRetry }) {
  if (error) {
    return <ErrorDisplay message={error.message} onRetry={onRetry} />
  }
  // ... normal content
}
```

### Page Layout
```javascript
function MyPage() {
  return (
    <Container maxWidth="7xl">
      <PageHeader
        title="Dashboard"
        description="Overview of your activity"
        showBack={true}
      />
      
      <Section title="Stats" action={<Button>Refresh</Button>}>
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Users" value="1,234" icon={Users} />
          <StatCard title="Revenue" value="$5,678" icon={DollarSign} />
        </div>
      </Section>
    </Container>
  )
}
```

---

## Performance Tips

### All Components Are Memoized
```javascript
// ✅ Components won't re-render unnecessarily
<LoadingState type="card" count={6} />

// ✅ No need to wrap with React.memo yourself
const MyComponent = () => {
  return <EmptyState title="Empty" />
}
```

### Stable Props
```javascript
// ✅ Good - using stable values
<EmptyState
  icon="search"
  title="No results"
  onAction={handleSearch}  // useCallback recommended
/>

// ❌ Avoid - creating new functions/objects on each render
<EmptyState
  icon="search"
  title="No results"
  onAction={() => console.log('clicked')}  // New function every render
/>
```

---

## Accessibility Built-in

### All Loading States Have ARIA
```javascript
// Automatically includes: role="status", aria-label
<LoadingState type="card" />
```

### All Error States Have Alerts
```javascript
// Automatically includes: role="alert", aria-live="assertive"
<ErrorDisplay title="Error" />
```

### Icons Are Hidden from Screen Readers
```javascript
// Icons automatically have: aria-hidden="true"
<EmptyState icon="search" title="No results" />
```

---

## TypeScript Support

### JSDoc Provides Type Hints
```javascript
// IntelliSense will show:
<LoadingState
  type="card"  // "card" | "list" | "table" | "default"
  count={6}    // number
/>

<EmptyState
  icon="search"  // "search" | "database" | "inbox" | etc.
  title=""       // string (required)
  onAction={}    // () => void (optional)
/>
```

---

## Full Documentation

See `docs/SHARED_COMPONENTS_LIBRARY.md` for:
- Complete API reference
- All prop options
- Migration examples
- Best practices
- Future roadmap

See `docs/PHASE_5_IMPROVEMENTS.md` for:
- Performance optimizations
- Accessibility features
- Implementation details
- Metrics & impact

---

**Last Updated:** December 1, 2025
