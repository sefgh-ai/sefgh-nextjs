1# Copilot Instructions for SEFGH

## Project Overview
SEFGH is an AI-powered GitHub repository search platform built with Next.js 16, React 19, Supabase, and shadcn/ui components. The app features a ChatGPT-style interface with code display, Canvas editor (like Claude Artifacts), real-time notifications, API playground, and repository submissions.

## Architecture

### Core Stack
- **Framework**: Next.js 16 (App Router) with React 19.2.0 and React Compiler enabled
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Auth**: Supabase Auth with SSR support via `@supabase/ssr`
- **UI**: shadcn/ui components (Radix UI primitives) with Tailwind CSS
- **Styling**: CSS variables for theming, custom design tokens in `tailwind.config.mjs`
- **AI Integration**: GitHub Models API (gpt-4o) via `src/lib/ai/github.js`

### Provider Hierarchy (Critical)
**Order matters** - maintained in `src/app/layout.js`:
```javascript
<ThemeProvider>
  <AuthProvider>
    <SettingsProvider>
      <LanguageProvider>
        <PageWrapper>{children}</PageWrapper>
      </LanguageProvider>
    </SettingsProvider>
  </AuthProvider>
</ThemeProvider>
```

### Supabase Client Pattern
**Two distinct clients** - never mix them:
- **Client Components**: `import { createClient } from '@/lib/supabase/client'` (browser client)
- **Server Components/Actions**: `import { createClient } from '@/lib/supabase/server'` (server client with cookies)
- **Middleware**: Uses `createServerClient` directly for session refresh

### Database Schema
Tables are created via SQL files in `supabase/`:
- `notifications.sql` - User notifications system
- `playground-schema.sql` - API keys, logs, limits for playground
- `repo-submissions-schema.sql` - User-submitted GitHub repos
- All tables use RLS policies scoped to `auth.uid()`

## Development Conventions

### Component Patterns
1. **Use `'use client'` directive** for components with:
   - Hooks (useState, useEffect, useContext)
   - Browser APIs or event handlers
   - Context consumers (useAuth, useSettings, useLanguage)

2. **shadcn/ui Components**: Located in `src/components/ui/`
   - Import via `@/components/ui/button`, etc.
   - Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
   - Customize via `buttonVariants` using class-variance-authority (cva)

3. **Styling Conventions**:
   - Custom classes: `glass-premium`, `shadow-soft`, `transition-smooth` (see `globals.css`)
   - Color system: Use CSS variables like `hsl(var(--primary))` for theme compatibility
   - Border radius: Custom scale (`rounded-xl`, `rounded-2xl`, etc.)
   - Dark mode: Forced to dark via `defaultTheme="dark"` and `enableSystem={false}`

### Critical Features

#### Canvas Component (`src/components/Canvas.jsx`)
- Side-by-side code editor (desktop) or fullscreen (mobile)
- Uses highlight.js for syntax highlighting (16+ languages registered)
- Three tabs: Edit, Preview (highlighted), Download
- Opened via markdown code block "Open in Canvas" button

#### MarkdownRenderer (`src/components/MarkdownRenderer.jsx`)
- Professional code blocks with syntax highlighting
- Copy button and "Open in Canvas" button per block
- Uses `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-raw`

#### Notifications System
- Real-time via Supabase subscriptions in `NotificationBell.jsx`
- Template-based notifications in `src/lib/notifications.js` (20+ types)
- Bell icon in header shows unread count
- Full page at `/notifications` for detailed view

#### Internationalization (i18n)
- Custom context-based solution (not next-intl routing)
- JSON files in `src/locales/` (8 languages: en, es, fr, de, ja, zh, hi, te)
- Access via `useLanguage()` hook: `const { t, locale, changeLanguage } = useLanguage()`
- Usage: `t('header.login')` resolves to nested JSON keys

### AI Integration
- **Provider**: GitHub Models API (Azure-hosted)
- **Model**: gpt-4o (default), configurable via options
- **Implementation**: `src/lib/ai/github.js` - `generateAIResponse(messages, options)`
- **Parameters**: 
  - `messages`: Array of `{role: 'user'|'assistant'|'system', content: string}`
  - `options`: `{model, temperature, max_tokens}` - all optional
- **API Endpoint**: `https://models.inference.ai.azure.com/chat/completions`
- **Authentication**: Bearer token from `GITHUB_TOKEN` env var
- **Error Handling**: Throws descriptive errors with status codes
- **Usage Pattern**:
  ```javascript
  import { generateAIResponse } from '@/lib/ai/github'
  
  const response = await generateAIResponse([
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'Hello!' }
  ], { temperature: 0.7 })
  ```

### API Routes
- AI chat endpoint integrates GitHub Models API (see AI Integration above)
- Conversation sharing in `api/conversations/[id]/share/` generates shareable links
- GitHub search proxied through API to avoid CORS

### Authentication Flow
1. Middleware (`middleware.js`) refreshes session on every request
2. `AuthContext` provides `{ user, loading, refreshUser, signOut }`
3. Protected pages check `if (!user && !loading)` and redirect to `/login`
4. Auth callback handled at `/auth/callback/page.js`

### Environment Variables (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # For server-side admin operations
GITHUB_TOKEN=  # For GitHub Models API
NEXT_PUBLIC_SITE_URL=  # Optional, for share links
```

## Common Tasks

### Adding a New Page
1. Create in `src/app/[route]/page.js`
2. Export metadata object for SEO
3. Add 'use client' if using hooks/context
4. Wrap auth-required pages with:
```javascript
const { user, loading } = useAuth()
if (!user && !loading) router.push('/login')
```

### Adding a Supabase Table
1. Write schema in `supabase/[feature]-schema.sql` with RLS policies
2. Test in Supabase SQL Editor
3. Document setup in README (users run SQL manually)
4. Use `user_id uuid references auth.users(id)` for user data

### Adding a shadcn Component
```bash
# Components are already configured (see components.json)
# Add new components to src/components/ui/
```

### Creating Notifications
```javascript
import { createNotification } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
await createNotification(
  supabase,
  userId,
  'info',  // or 'success', 'warning', 'error'
  'Title',
  'Message',
  '/link'  // optional
)
```

## Debugging

### Dev Server Issues
- **Port 3000 in use**: Kill Node processes: `taskkill /F /IM node.exe` (Windows CMD)
- **Check**: Terminal shows `npm run dev` failures - port conflict is common

### Build Issues
- React Compiler enabled via `reactCompiler: true` in `next.config.mjs`
- Ensure all dependencies compatible with React 19

### Hydration Errors
- Check `suppressHydrationWarning` on `<html>` tag (for theme)
- Verify server/client render consistency

## Code Style
- Use double quotes for strings
- Prefer arrow functions
- No semicolons (project follows this pattern)
- Organize imports: external → internal → components → UI components
- Add JSDoc comments for utility functions (see `src/lib/github-api.js`)

## Testing Approach
- Manual testing in browser (no test framework configured)
- Validate Supabase queries in SQL Editor first
- Use browser DevTools for debugging client-side logic

## Additional Information
*To be updated with:*
- API Playground workflows and testing patterns
- Deployment instructions
- Additional provider configurations
- Other architectural considerations
