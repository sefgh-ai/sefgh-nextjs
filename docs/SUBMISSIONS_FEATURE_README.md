# Repository Submissions Feature - Setup Guide

## 📋 Database Setup

### Step 1: Run SQL Schema in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `supabase/repo-submissions-schema.sql`
4. Copy and paste the entire SQL content
5. Click **Run** to execute

This will create:
- ✅ `repo_submissions` table with all required fields
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for better performance

---

## 🎯 Features Implemented

### 1. **Submit Modal** (`/src/components/SubmitProjectDialog.jsx`)
- ✅ Authentication check (non-logged-in users redirected to login)
- ✅ GitHub URL validation
- ✅ Form validation (title: 10-100 chars, description: 10-300 chars)
- ✅ Duplicate URL detection
- ✅ Auto-fetch repository data from GitHub API
- ✅ Auto-detect tags (languages, topics)
- ✅ Insert into Supabase
- ✅ Success/error toast notifications

### 2. **Sidebar Navigation** (`/src/components/search/SearchSidebar.jsx`)
- ✅ Added "Submissions" menu item in "Your Content" section
- ✅ Positioned above "History"
- ✅ Upload icon (ArrowUpTrayIcon)
- ✅ Active state highlighting
- ✅ Links to `/submissions` page

### 3. **Submissions Page** (`/src/app/submissions/page.js`)
- ✅ Protected route (login required)
- ✅ Fetch user-specific submissions
- ✅ Display in card grid layout
- ✅ Show submission date/time
- ✅ Delete button (removes from UI only, not database)
- ✅ Empty state with call-to-action
- ✅ Loading skeleton
- ✅ Tags display
- ✅ Link to GitHub repository

### 4. **GitHub API Helper** (`/src/lib/github-api.js`)
- ✅ URL validation
- ✅ Parse GitHub URLs
- ✅ Fetch repository data from GitHub API
- ✅ Extract tags (language + topics)
- ✅ Error handling

---

## 🗄️ Database Schema

```sql
repo_submissions
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── url (TEXT, UNIQUE)
├── title (TEXT)
├── description (TEXT)
├── tags (TEXT[])
└── submitted_at (TIMESTAMPTZ)
```

---

## 🔒 Security (RLS Policies)

- ✅ Users can only view their own submissions
- ✅ Users can only insert their own submissions
- ✅ Auto-approved (no manual approval needed)

---

## 🎨 UI/UX Flow

### Submission Flow:
1. User clicks "Submit" button in navbar
2. Check if logged in:
   - ❌ Not logged in → Toast + Redirect to /login
   - ✅ Logged in → Open modal
3. User fills form (URL, Title, Description)
4. On submit:
   - Validate all fields
   - Check duplicate URL
   - Fetch GitHub data & auto-detect tags
   - Insert into database
   - Show success toast
   - Close modal

### Viewing Submissions:
1. User clicks "Submissions" in sidebar
2. Navigate to `/submissions` page
3. Display user's submissions in grid
4. Each card shows:
   - Title
   - Description
   - Tags (max 3 visible)
   - Submission date/time
   - Delete button
   - "View on GitHub" button

### Delete Behavior:
- ✅ Click delete → Remove from UI immediately
- ✅ Data remains in database (soft delete)
- ✅ Show success toast

---

## 🧪 Testing Checklist

### Test Submit Modal:
- [ ] Non-logged-in user clicks Submit → Redirected to login
- [ ] Logged-in user clicks Submit → Modal opens
- [ ] Invalid GitHub URL → Error toast
- [ ] Valid URL → Fetches GitHub data successfully
- [ ] Duplicate URL → Error toast
- [ ] Successful submission → Success toast + modal closes

### Test Submissions Page:
- [ ] Non-logged-in user visits /submissions → Redirected to login
- [ ] Logged-in user sees only their submissions
- [ ] Empty state shows when no submissions
- [ ] Delete button removes card from UI
- [ ] "View on GitHub" opens repository in new tab
- [ ] Submission date/time displays correctly
- [ ] Tags display correctly

### Test Sidebar:
- [ ] "Submissions" menu item visible for logged-in users
- [ ] Menu item highlighted when on /submissions page
- [ ] Clicking navigates to /submissions

---

## 🚀 Next Steps (Future Enhancements)

1. **Admin Panel** (Later)
   - Approve/reject submissions
   - Moderate content
   - View all submissions

2. **Additional Features** (Optional)
   - Edit submissions
   - Search/filter submissions
   - Sort by date/title
   - Export submissions
   - Submission statistics

---

## 📝 Notes

- All submissions are **auto-approved**
- Delete only **removes from UI**, data persists in database
- Tags are **auto-detected** from GitHub (language + topics)
- GitHub API has rate limits (60 requests/hour for unauthenticated)
- Consider adding GitHub token for higher rate limits if needed

---

## ✅ Ready to Use!

All features are implemented and ready to test. Just run the SQL schema in Supabase and you're good to go! 🎉
