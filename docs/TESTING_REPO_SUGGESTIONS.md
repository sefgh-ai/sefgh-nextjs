# 🧪 Testing Repository Suggestions Feature

## Quick Test Guide

### 1️⃣ Start Development Server
```bash
npm run dev
```

### 2️⃣ Navigate to Chat Page
- Open browser: `http://localhost:3000/chat`
- Login if needed

### 3️⃣ Test Prompts

#### Test A: JSON Format (AI will use this automatically)
**Prompt:** "Show me the top 3 React repositories"

**Expected AI Response:**
```
Here are three excellent React repositories:

```repos-json
[
  {
    "full_name": "facebook/react",
    "description": "A JavaScript library for building user interfaces",
    "stargazers_count": 220000,
    "forks_count": 45000,
    "language": "JavaScript",
    "html_url": "https://github.com/facebook/react"
  }
]
```

These repositories are great for learning React...
```

**What you'll see:**
- Blue gradient card with "Suggested Repositories" header
- Repository cards in a grid (clickable)
- Clean markdown text (JSON block removed from display)

---

#### Test B: URL Detection (Automatic)
**Prompt:** "I want to learn Next.js"

**Expected AI Response:**
```
To learn Next.js, check out the official repository at https://github.com/vercel/next.js 
and the learning examples at https://github.com/vercel/next-learn
```

**What you'll see:**
- Same blue card container
- Repos automatically fetched and displayed
- URLs still visible in text (not removed)

---

#### Test C: Click Repository
1. After repos appear, click any repository card
2. **Desktop:** CodeExplorer opens in right sidebar (50% width)
3. **Mobile:** CodeExplorer opens fullscreen
4. Browse repository files
5. Click X or "Close Repository" to close

---

### 4️⃣ Visual Checklist

✅ **Repository Card Container:**
- [ ] Blue gradient background
- [ ] "Suggested Repositories" header with GitHub icon
- [ ] Expand/collapse button (chevron icon)
- [ ] Shows count: "3 repositories • Click to explore"

✅ **Repository Cards:**
- [ ] Repository name (clickable)
- [ ] Description
- [ ] Stars ⭐, Forks 🍴, Language badge
- [ ] Updated date, License
- [ ] Copy URL, Clone, Open buttons (on hover)

✅ **Interactions:**
- [ ] Hover on card shows shadow effect
- [ ] Click card opens CodeExplorer
- [ ] Collapse/expand works smoothly
- [ ] Loading animation shows while fetching

✅ **Theme Match:**
- [ ] Glass-premium styling
- [ ] Blue color scheme matches app
- [ ] Smooth transitions
- [ ] Responsive layout

---

### 5️⃣ Manual Test (Without AI)

If you want to test the UI directly without waiting for AI:

**Edit a message in the database or use this test component:**

```jsx
// Test in browser console or add to page temporarily
const testRepos = [
  {
    id: 1,
    full_name: "facebook/react",
    description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    stargazers_count: 220000,
    forks_count: 45000,
    language: "JavaScript",
    html_url: "https://github.com/facebook/react",
    updated_at: "2024-01-15T10:30:00Z",
    license: { name: "MIT License" }
  }
]
```

---

### 6️⃣ Common Issues & Solutions

**Issue: Repos not showing**
- Check browser console for errors
- Verify GITHUB_TOKEN in .env.local
- Check GitHub API rate limits

**Issue: Slow loading**
- Initial fetch may take 1-2 seconds
- Loading animation should show
- Check network tab for API calls

**Issue: AI not suggesting repos**
- Try more specific prompts
- Explicitly mention "show me repos" or "GitHub repositories"
- AI is trained to suggest for relevant queries

---

### 7️⃣ Example Conversations

**Conversation 1: Learning Path**
```
You: "I want to learn full-stack development with JavaScript"
AI: "Here's a great learning path... [suggests repos for React, Node.js, Express, MongoDB]"
```

**Conversation 2: Comparison**
```
You: "Compare React vs Vue"
AI: "Let me show you both frameworks... [suggests React and Vue repos]"
```

**Conversation 3: Specific Topic**
```
You: "Best state management libraries for React"
AI: "Here are the top state management solutions... [suggests Redux, Zustand, Jotai repos]"
```

---

### 8️⃣ Success Criteria

✅ Repository suggestions appear in chat
✅ Cards are clickable and themed correctly
✅ CodeExplorer opens when clicking repos
✅ Both JSON and URL detection work
✅ Loading states are smooth
✅ Mobile responsive
✅ No console errors

---

**Happy Testing! 🚀**
