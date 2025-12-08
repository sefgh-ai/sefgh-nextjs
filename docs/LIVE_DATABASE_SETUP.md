# Live Database Integration - Setup Guide

This guide will help you set up the live Supabase database for the home page with real-time updates.

## 🎯 Overview

We've implemented a complete live data system with:
- **Projects table** with real-time subscriptions
- **Categories table** with dynamic management
- **User-created categories** with UI
- **Real-time updates** for both projects and categories
- **RLS policies** for secure access

## 📋 Setup Steps

### 1. Create Database Tables

Run these SQL files in your Supabase SQL Editor in this order:

#### Step 1: Projects Table
```bash
# File: supabase/projects-schema.sql
```
This creates:
- `projects` table with all necessary fields
- Indexes for performance
- RLS policies (public read, authenticated write)
- Auto-update timestamp trigger

#### Step 2: Categories Table
```bash
# File: supabase/categories-schema.sql
```
This creates:
- `categories` table with dynamic category management
- Type-based categorization (programming, technology, application, other, custom)
- Usage count tracking
- RLS policies for user-created categories

#### Step 3: Seed Initial Data
```bash
# File: supabase/seed-data.sql
```
This populates:
- 68 predefined categories (all the tags from PreferencesDialog)
- 6 sample projects (from the original mock data)
- Initial usage counts

### 2. Run in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each file's content in order:
   - First: `projects-schema.sql`
   - Second: `categories-schema.sql`
   - Third: `seed-data.sql`
4. Click **Run** for each

### 3. Verify Setup

After running the SQL files, verify in Supabase:

**Table Editor** → Check these tables exist:
- ✅ `projects` (should have 6 rows)
- ✅ `categories` (should have 68 rows)

**Database** → **Policies** → Verify RLS is enabled for both tables

## 🔄 How It Works

### Projects Feed (Real-time)

**File: `src/app/home/hooks/useProjects.js`**

- Fetches projects from Supabase on mount
- Subscribes to real-time changes
- Supports tab filtering (latest/monthly/yearly)
- Auto-updates on INSERT/UPDATE/DELETE events

```javascript
const { allProjects, loading } = useProjects(selectedTab);
```

### Categories Management (Real-time)

**File: `src/app/home/hooks/useCategories.js`**

- Fetches categories from Supabase
- Real-time subscription for category changes
- Functions: `addCategory`, `updateCategory`, `deleteCategory`
- Sorted by usage count and name

```javascript
const { categories, loading, addCategory } = useCategories();
```

### Categories Sidebar

**File: `src/components/home/CategoriesSidebar.jsx`**

- Now uses `useCategories()` hook
- Shows live categories from database
- Displays usage count for each category
- Updates in real-time when categories change

### Preferences Dialog

**File: `src/components/PreferencesDialog.jsx`**

- Fetches all categories from database
- Grouped by type (Programming, Technology, Application, Other, Custom)
- **NEW**: Add custom categories UI
  - Select emoji icon
  - Enter category name
  - Choose type
  - Saves directly to database
- Shows usage count per category
- Real-time updates when new categories added

## 🎨 New Features

### 1. Add Custom Categories

Users can now add their own categories:

1. Open Preferences dialog
2. Click "Add Custom Category" (requires login)
3. Choose emoji, enter name, select type
4. Click "Add to Database"
5. Category appears instantly (real-time)

### 2. Live Usage Tracking

Categories show usage count based on how many projects use them:
- Displayed in sidebar: `Python (12)`
- Displayed in preferences: `Python (12)`
- Auto-sorted by popularity

### 3. Real-time Updates

All changes reflect instantly:
- New project added → Appears in feed
- Project updated → Updates in feed
- Category added → Appears in sidebar
- No page refresh needed!

## 🧪 Testing

### Test Real-time Projects

1. Open home page in two browser windows
2. In Supabase SQL Editor, insert a new project:
```sql
INSERT INTO public.projects (
  title, description, author, avatar, language,
  views, stars, comments, category, tags, trending
) VALUES (
  'Test Real-time Project',
  'This should appear instantly in both windows!',
  'TestUser',
  '🧪',
  'TypeScript',
  100, 50, 5,
  'JavaScript',
  ARRAY['React', 'Test'],
  true
);
```
3. Watch it appear in both windows without refresh!

### Test Real-time Categories

1. Open Preferences dialog
2. Add a custom category
3. It should appear instantly in:
   - The Preferences dialog
   - The Categories sidebar
   - Available for selection

### Test Filtering

1. Select a category in sidebar → Feed filters
2. Open Preferences → Select multiple tags → Save
3. Sidebar shows selected tags
4. Feed filters by OR/AND mode

## 📊 Database Schema

### Projects Table

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | Project title |
| description | text | Project description |
| author | text | Author name |
| avatar | text | Emoji avatar |
| language | text | Programming language |
| views | integer | View count |
| stars | integer | Star count |
| comments | integer | Comment count |
| category | text | Primary category |
| tags | text[] | Array of tags |
| trending | boolean | Trending flag |
| github_url | text | GitHub repo URL |
| user_id | uuid | Foreign key to auth.users |
| created_at | timestamp | Auto-set on insert |
| updated_at | timestamp | Auto-updated on change |

### Categories Table

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Category name (unique) |
| icon | text | Emoji icon |
| type | text | programming/technology/application/other/custom |
| description | text | Category description |
| usage_count | integer | How many projects use it |
| created_by | uuid | Foreign key to auth.users |
| is_active | boolean | Active/deactivated |
| created_at | timestamp | Auto-set on insert |
| updated_at | timestamp | Auto-updated on change |

## 🔐 Security (RLS Policies)

### Projects
- **Read**: Everyone (public)
- **Insert**: Authenticated users (own projects)
- **Update**: Users can update their own projects
- **Delete**: Users can delete their own projects

### Categories
- **Read**: Everyone (active categories only)
- **Insert**: Authenticated users
- **Update**: Users can update categories they created
- **Deactivate**: Users can deactivate their own categories

## 🚀 Next Steps

1. **Add Projects API**: Create an API endpoint for users to submit projects
2. **Add Voting**: Implement upvote/downvote system
3. **Add Comments**: Link to `repo_details` comments system
4. **Add User Profiles**: Link projects to user profiles
5. **Add Search**: Implement full-text search across projects
6. **Add Pagination**: Add infinite scroll or pagination

## 📝 Current Implementation Status

✅ **Completed**:
- Projects table with RLS
- Categories table with RLS
- Seed data (68 categories + 6 projects)
- Real-time subscriptions for projects
- Real-time subscriptions for categories
- useProjects hook with real-time updates
- useCategories hook with CRUD operations
- CategoriesSidebar using live data
- PreferencesDialog using live data
- Add custom categories UI
- Tab filtering (latest/monthly/yearly)
- Usage count tracking and display

🎯 **Ready to Use**:
- Run the SQL files in Supabase
- Restart your dev server
- Home page will now use live data!

## 🐛 Troubleshooting

### No data showing
- Check Supabase connection (verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env)
- Verify tables were created (check Supabase Table Editor)
- Verify seed data was inserted (check row counts)
- Check browser console for errors

### Real-time not working
- Verify Supabase project has Realtime enabled
- Check subscription status in browser DevTools → Network → WS
- Ensure RLS policies allow reads

### Can't add categories
- User must be logged in
- Check browser console for error messages
- Verify RLS policies allow inserts for authenticated users

## 📚 File Reference

### New Files Created:
1. `supabase/projects-schema.sql` - Projects table schema
2. `supabase/categories-schema.sql` - Categories table schema
3. `supabase/seed-data.sql` - Initial data population
4. `src/app/home/hooks/useCategories.js` - Categories management hook

### Modified Files:
1. `src/app/home/hooks/useProjects.js` - Added real-time subscriptions
2. `src/components/home/CategoriesSidebar.jsx` - Using live categories
3. `src/components/PreferencesDialog.jsx` - Using live categories + add UI

### Unchanged (still works):
- `src/app/home/page.js` - Main page component
- `src/app/home/hooks/useFilteredProjects.js` - Filtering logic
- All other components
