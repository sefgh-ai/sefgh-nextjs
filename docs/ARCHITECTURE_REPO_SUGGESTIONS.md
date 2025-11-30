# 🏗️ Repository Suggestions Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                         (Chat Page)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ User asks about repos
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI CHAT ENDPOINT                           │
│                   /api/ai/chat/route.js                         │
│                                                                 │
│  → Receives user message                                       │
│  → Adds system prompt with repo instructions                   │
│  → Calls GitHub Models API (gpt-4o)                            │
│  → Returns AI response                                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ AI response with repos
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   AIMESSAGERENDERER                             │
│            src/components/AIMessageRenderer.jsx                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. Receives AI message content                           │ │
│  │ 2. Calls parseRepoSuggestions()                          │ │
│  │ 3. Splits into:                                          │ │
│  │    • Cleaned markdown content                            │ │
│  │    • Repository data array                               │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────┬────────────────────────────────┬───────────────────┘
             │                                │
             ↓                                ↓
┌────────────────────────┐       ┌──────────────────────────────┐
│   MARKDOWNRENDERER     │       │    REPOSUGGESTIONS           │
│ MarkdownRenderer.jsx   │       │  RepoSuggestions.jsx         │
│                        │       │                              │
│ • Renders text         │       │ • Blue container             │
│ • Code blocks          │       │ • GitHub icon header         │
│ • Links, lists, etc.   │       │ • Expand/collapse            │
│ • Canvas integration   │       │ • Grid of cards              │
└────────────────────────┘       └──────────┬───────────────────┘
                                            │
                                            │ Maps repos to cards
                                            ↓
                                 ┌──────────────────────────────┐
                                 │    REPOSITORYCARD            │
                                 │  RepositoryCard.jsx          │
                                 │                              │
                                 │ • Repo name & description    │
                                 │ • Stars, forks, language     │
                                 │ • Updated date, license      │
                                 │ • Action buttons (hover)     │
                                 │ • onClick → onSelect(repo)   │
                                 └──────────┬───────────────────┘
                                            │
                                            │ User clicks card
                                            ↓
                                 ┌──────────────────────────────┐
                                 │    CHAT PAGE                 │
                                 │  chat/page.js                │
                                 │                              │
                                 │  handleSelectRepoFromAI()    │
                                 │  → setSelectedRepo(repo)     │
                                 │  → Opens CodeExplorer        │
                                 └──────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARSING PIPELINE                             │
└─────────────────────────────────────────────────────────────────┘

AI Response Content
        │
        ↓
┌───────────────────────────────────────────────────────────────┐
│                   parse-repos.js                              │
│                parseRepoSuggestions()                         │
└───────────────────────────────────────────────────────────────┘
        │
        ├─────────────────────┬─────────────────────────────────┐
        ↓                     ↓                                 ↓
┌───────────────┐   ┌──────────────────┐         ┌────────────────────┐
│ Extract JSON  │   │ Extract GitHub   │         │ Fetch Repo Data    │
│ Code Blocks   │   │ URLs             │         │ from API           │
│               │   │                  │         │                    │
│ repos-json    │   │ Regex pattern    │         │ /api/github/repo   │
│ ```blocks```  │   │ github.com/...   │         │ ?owner=x&name=y    │
└───────┬───────┘   └────────┬─────────┘         └─────────┬──────────┘
        │                    │                             │
        │ Parse JSON         │ owner/repo pairs            │ Fetch from
        ↓                    ↓                             ↓ GitHub API
  ┌─────────┐          ┌─────────┐                  ┌─────────┐
  │ Repo 1  │          │ URL 1   │──────GET────────→│ API     │
  │ Repo 2  │          │ URL 2   │                  │ Response│
  │ Repo 3  │          └─────────┘                  └─────────┘
  └────┬────┘                 │                           │
       │                      │                           │
       └──────────────────────┴───────────────────────────┘
                              │
                              ↓ Merge & deduplicate
                    ┌──────────────────┐
                    │  Final Repo List │
                    │  [repo1, repo2]  │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Return to        │
                    │ AIMessageRenderer│
                    └──────────────────┘
```

---

## Component Hierarchy

```
ChatPage
├── Messages Loop
│   └── Message (Assistant)
│       └── AIMessageRenderer ⭐
│           ├── MarkdownRenderer
│           │   ├── Code Blocks
│           │   ├── Links
│           │   └── Text Content
│           │
│           └── RepoSuggestions ⭐
│               ├── Header (GitHub icon, title, count)
│               ├── Expand/Collapse Button
│               └── Repository Grid
│                   ├── RepositoryCard (Repo 1)
│                   ├── RepositoryCard (Repo 2)
│                   └── RepositoryCard (Repo 3)
│
└── CodeExplorer Sidebar
    └── Opens when repo card clicked
```

---

## API Communication Flow

```
Browser                    Next.js Server              GitHub API
   │                             │                          │
   │──── User Message ────────→  │                          │
   │                             │                          │
   │                             │──── AI Request ────────→ │
   │                             │    (with system prompt)  │
   │                             │                          │
   │                             │←─── AI Response ────────│
   │                             │    (with repos-json)     │
   │                             │                          │
   │←─── AI Response ──────────  │                          │
   │     (parse client-side)     │                          │
   │                             │                          │
   │──── Fetch Repo Data ──────→ │                          │
   │     /api/github/repo        │                          │
   │                             │                          │
   │                             │──── GET /repos/x/y ────→ │
   │                             │                          │
   │                             │←─── Repo Data ──────────│
   │                             │     (stars, forks, etc.) │
   │                             │                          │
   │←─── Repo Data ────────────  │                          │
   │                             │                          │
   │                             │                          │
   │  (Display RepoSuggestions)  │                          │
```

---

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Chat Page State                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  messages: [                                            │
│    {                                                    │
│      role: 'assistant',                                 │
│      content: 'Here are repos...\n```repos-json...'     │
│    }                                                    │
│  ]                                                      │
│                                                         │
│  selectedRepo: null | { id, full_name, ... }           │
│    ↓ When set → Opens CodeExplorer                     │
│                                                         │
│  showCanvas: boolean                                    │
│    ↓ For code editing                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              AIMessageRenderer State                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  parsedData: {                                          │
│    repos: [...],          // Array of repo objects      │
│    cleanedContent: '...', // Markdown without JSON      │
│    hasRepos: true         // Boolean flag               │
│  }                                                      │
│                                                         │
│  loading: boolean         // While parsing/fetching     │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               RepoSuggestions State                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  expanded: boolean        // Collapse/expand state      │
│    Default: true                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Error Scenarios                       │
└─────────────────────────────────────────────────────────┘

Scenario 1: Invalid JSON
───────────────────────
repos-json block has syntax error
        ↓
JSON.parse() throws
        ↓
Caught in try-catch
        ↓
Log error to console
        ↓
Continue with URL detection
        ↓
Show repos from URLs only


Scenario 2: GitHub API Fails
────────────────────────────
URL detected: github.com/owner/repo
        ↓
Fetch /api/github/repo fails
        ↓
404 or 500 error
        ↓
Return null from fetch
        ↓
Filter out null values
        ↓
Show only successful repos


Scenario 3: Rate Limit Hit
──────────────────────────
Multiple URL fetches
        ↓
GitHub API returns 403
        ↓
API route throws error
        ↓
Caught in Promise.all
        ↓
Show repos that succeeded
        ↓
Log rate limit warning


Scenario 4: No Repos Found
──────────────────────────
No JSON blocks found
No GitHub URLs found
        ↓
parsedData.repos = []
        ↓
parsedData.hasRepos = false
        ↓
RepoSuggestions returns null
        ↓
Only markdown content shown
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────┐
│                 Optimization Strategy                   │
└─────────────────────────────────────────────────────────┘

1. Client-Side Parsing
   ↓
   No server round-trip for parsing
   Instant JSON repo display

2. Parallel API Calls
   ↓
   Promise.all() for URL fetches
   All repos load simultaneously

3. API Route Caching
   ↓
   next: { revalidate: 3600 }
   1 hour cache on repo data

4. Conditional Rendering
   ↓
   hasRepos check before render
   No wasted renders

5. Lazy Loading
   ↓
   RepoSuggestions only mounts if hasRepos
   Saves component lifecycle

6. Optimistic UI
   ↓
   Show JSON repos immediately
   Fetch URL repos in background
   Progressive enhancement
```

---

**This architecture ensures fast, reliable, and beautiful repository suggestions in chat!**
