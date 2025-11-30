# 🚀 Repository Suggestions - Quick Reference

## ⚡ Quick Start

```bash
npm run dev
# Navigate to http://localhost:3000/chat
# Try: "Show me popular React repositories"
```

---

## 🎯 How It Works

### User Flow
1. Ask AI about repositories → 2. Repos appear in blue container → 3. Click card → 4. Explore in sidebar

### AI Response Methods
- **Method 1:** JSON block (`repos-json`)
- **Method 2:** GitHub URLs (auto-detected)

---

## 📦 Example Prompts

| Prompt | Expected Result |
|--------|-----------------|
| "Show me React repos" | Top React repositories |
| "Best Python ML libraries" | TensorFlow, PyTorch, etc. |
| "Node.js frameworks" | Express, Fastify, NestJS |
| "Compare Next.js vs Remix" | Both framework repos |

---

## 🎨 Visual Elements

```
┌──────────────────────────────────────┐
│ 📦 Suggested Repositories       [▼] │
│ 3 repositories • Click to explore    │
├──────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐       │
│  │ Repo Card │  │ Repo Card │       │
│  │ ⭐ 220k   │  │ ⭐ 120k   │       │
│  └───────────┘  └───────────┘       │
└──────────────────────────────────────┘
```

---

## 🔧 Components

| Component | Purpose |
|-----------|---------|
| `RepoSuggestions` | Container with expand/collapse |
| `AIMessageRenderer` | Parser + display orchestrator |
| `parse-repos.js` | Extract repos from text |
| `api/github/repo` | Fetch repo data |

---

## 📱 Features

✅ Dual detection (JSON + URLs)
✅ Themed blue design
✅ Clickable cards → CodeExplorer
✅ Responsive (mobile/desktop)
✅ Expand/collapse
✅ Loading states

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Repos not showing | Check console, verify GITHUB_TOKEN |
| Slow loading | Normal (1-2s), check network tab |
| AI not suggesting | Use specific prompts |

---

## 📄 Documentation

- `REPO_SUGGESTIONS_GUIDE.md` - Complete guide
- `TESTING_REPO_SUGGESTIONS.md` - Test instructions
- `REPO_SUGGESTIONS_VISUAL.md` - Visual preview
- `IMPLEMENTATION_REPO_SUGGESTIONS.md` - Technical summary

---

## ✨ Key Files

```
src/
├── components/
│   ├── RepoSuggestions.jsx ⭐
│   ├── AIMessageRenderer.jsx ⭐
│   └── RepositoryCard.jsx (existing)
├── lib/
│   ├── parse-repos.js ⭐
│   └── ai/github.js (updated)
└── app/
    ├── chat/page.js (updated)
    └── api/github/repo/route.js ⭐
```

---

**Status: ✅ READY TO USE**
