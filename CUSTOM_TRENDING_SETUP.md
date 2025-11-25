# Custom Trending System - Setup Guide

## Overview
A curated trending repository system that fetches and displays GitHub repos by topic categories. Updates every 3 days with manual refresh option.

## Features
✅ **6 Curated Topics**: AI/ML, Web Dev, Mobile, DevOps, Data Science, Security  
✅ **Auto-Refresh**: Updates every 3 days (configurable)  
✅ **Manual Refresh**: Click button to update anytime  
✅ **Topic Badges**: Shows topic on each repo card  
✅ **Smart Criteria**: Recent repos (last 30 days) with 100+ stars  
✅ **Database Caching**: Stored in Supabase to avoid rate limits  

---

## Setup Instructions

### 1. Create Database Table

**Open Supabase Dashboard** → SQL Editor → Run this:

```bash
# Copy this file to Supabase SQL Editor:
supabase/trending-repos-schema.sql
```

**Verify:**
```sql
SELECT * FROM trending_repos;
```
Should show empty table with columns: `id`, `topic`, `repo_full_name`, `repo_data`, `rank`, etc.

---

### 2. Initial Data Fetch

**Method A: Using API (Recommended)**

Open your browser and visit:
```
http://localhost:3000/api/trending/refresh
```

Then click the "Refresh Trending" button on `/trending` page.

**Method B: Using curl**
```bash
curl -X POST http://localhost:3000/api/trending/refresh
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Trending repos refreshed successfully",
  "totalRepos": 30,
  "results": [
    { "topic": "ai-ml", "success": true, "count": 5 },
    { "topic": "web-dev", "success": true, "count": 5 },
    ...
  ]
}
```

---

### 3. Verify Data

Check Supabase:
```sql
SELECT topic, COUNT(*) as repo_count 
FROM trending_repos 
GROUP BY topic;
```

Should show 5 repos per topic (total ~30 repos).

---

## How It Works

### Topic Definitions
Located in `src/lib/trending.js`:

```javascript
export const TRENDING_TOPICS = [
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    query: 'topic:artificial-intelligence OR topic:machine-learning...'
  },
  // ... 5 more topics
]
```

### Trending Criteria (Option A - Recent + Popular)
- **Created**: Last 30 days
- **Minimum Stars**: 100+
- **Sorted By**: Stars (descending)
- **Count**: Top 5 per topic

### Auto-Refresh Schedule
- **Every 3 days** automatically
- Manual refresh button available
- Checks staleness on page load

---

## Usage

### Viewing Trending Repos

1. Navigate to `/trending` page
2. See curated repos with **topic badges** (🤖 AI & ML, 🌐 Web Dev, etc.)
3. Repos are mixed with GitHub's trending data
4. Filter by language, spoken language, date range

### Manual Refresh

1. Click **"Refresh Trending"** button in header
2. Wait ~1 minute (fetches 6 topics with rate limiting)
3. Toast notification shows success/failure
4. Page auto-updates with new data

### Check Refresh Status

```bash
GET http://localhost:3000/api/trending/refresh
```

Response:
```json
{
  "isStale": false,
  "lastRefresh": "2025-11-08T10:30:00Z",
  "nextRefreshDue": "2025-11-11T10:30:00Z",
  "canRefresh": true
}
```

---

## Customization

### Change Topics

Edit `src/lib/trending.js`:

```javascript
// Add new topic
{
  id: 'blockchain',
  name: 'Blockchain & Web3',
  icon: '⛓️',
  query: 'topic:blockchain OR topic:web3 OR topic:cryptocurrency'
}
```

### Change Criteria

Edit `src/app/api/trending/refresh/route.js`:

```javascript
// Change to last 60 days, min 50 stars
const sixtyDaysAgo = new Date()
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
const query = `${topic.query} created:>${dateStr} stars:>50`
```

### Change Repos Per Topic

```javascript
// In route.js, change per_page
const url = `...&per_page=10` // Show 10 instead of 5
```

### Change Refresh Interval

Edit `src/lib/trending.js`:

```javascript
export async function isTrendingDataStale() {
  // Change to 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return fetchedAt < sevenDaysAgo
}
```

---

## API Endpoints

### POST /api/trending/refresh
Fetches new trending data from GitHub.

**Request:**
```bash
curl -X POST http://localhost:3000/api/trending/refresh
```

**Response:**
```json
{
  "success": true,
  "totalRepos": 30,
  "results": [...]
}
```

### GET /api/trending/refresh
Check refresh status.

**Response:**
```json
{
  "isStale": false,
  "lastRefresh": "2025-11-08T10:30:00Z",
  "nextRefreshDue": "2025-11-11T10:30:00Z"
}
```

---

## Automation (Optional)

### Setup Cron Job

Use a service like **Vercel Cron** or **GitHub Actions**:

**Vercel Cron** (vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/trending/refresh",
      "schedule": "0 0 */3 * *"
    }
  ]
}
```

**GitHub Actions** (.github/workflows/refresh-trending.yml):
```yaml
name: Refresh Trending Repos
on:
  schedule:
    - cron: '0 0 */3 * *' # Every 3 days at midnight
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Refresh
        run: |
          curl -X POST https://your-domain.com/api/trending/refresh
```

---

## Troubleshooting

### No Data Showing

**Check 1:** Database table exists?
```sql
SELECT COUNT(*) FROM trending_repos;
```

**Check 2:** Data fetched?
```bash
curl http://localhost:3000/api/trending/refresh
```

**Check 3:** Console errors?
Open browser DevTools → Console tab

---

### GitHub Rate Limit

**Error:** "API returned 403"

**Solution:** Add GitHub token to `.env.local`:
```bash
GITHUB_TOKEN=ghp_your_token_here
```

Get token: https://github.com/settings/tokens

---

### Refresh Button Not Working

**Check:** Network tab in DevTools
- Request to `/api/trending/refresh` should return 200
- Check response JSON for errors

**Fix:** Clear old data and retry:
```sql
DELETE FROM trending_repos;
```

---

## Files Created

```
src/
├── lib/
│   └── trending.js                    # Helper functions & topic definitions
└── app/
    └── api/
        └── trending/
            └── refresh/
                └── route.js           # API endpoint for refresh

supabase/
└── trending-repos-schema.sql          # Database schema

CUSTOM_TRENDING_SETUP.md               # This file
```

## Files Modified

```
src/app/trending/page.js               # Added custom trending integration
```

---

## Next Steps

1. ✅ Run database migration
2. ✅ Fetch initial data (POST to `/api/trending/refresh`)
3. ✅ Visit `/trending` page
4. ✅ See topic badges on repo cards
5. ✅ Test manual refresh button
6. 🔄 (Optional) Setup cron job for auto-refresh

---

**Status:** ✅ Ready to Use  
**Last Updated:** November 8, 2025  
**Version:** 1.0.0
