# 🚀 SETUP INSTRUCTIONS - Profiles Table

## ⚡ Quick Start (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **sefgh-nextjs** (or your project name)

### Step 2: Navigate to SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button (top right)

### Step 3: Copy & Paste SQL
1. Open the file: `supabase/QUICK_SETUP.sql`
2. **Copy ALL the content** (Ctrl+A, Ctrl+C)
3. **Paste** into the SQL Editor in Supabase
4. Click **"Run"** (or press Ctrl+Enter)

### Step 4: Verify Setup
You should see: ✅ Success message "Success. No rows returned"

To verify the table was created, run this query:
```sql
SELECT * FROM profiles LIMIT 5;
```

### Step 5: Test with a New User
1. Go to your app: http://localhost:3000
2. Sign up a new user
3. Check your Supabase dashboard → Table Editor → profiles
4. You should see a new row with the user's data! ✅

---

## 📊 What This Does

### Automatic Syncing
- ✅ When a user signs up → Profile is created automatically
- ✅ When user updates metadata → Profile is updated automatically
- ✅ When user is deleted → Profile is deleted automatically

### Security (RLS Policies)
- ✅ **Read**: Everyone can view all profiles (public)
- ✅ **Create**: Users can only create their own profile
- ✅ **Update**: Users can only update their own profile
- ✅ **Delete**: Users can only delete their own profile

### Fields in Profiles Table
| Field | Type | Description | Editable |
|-------|------|-------------|----------|
| `id` | UUID | User ID (from auth.users) | No |
| `email` | TEXT | User's email | Auto-synced |
| `full_name` | TEXT | User's full name | Auto-synced |
| `avatar_url` | TEXT | Profile picture URL | Auto-synced |
| `bio` | TEXT | User's bio (max 500 chars) | Yes ✏️ |
| `website` | TEXT | User's website | Yes ✏️ |
| `created_at` | TIMESTAMP | Account creation date | No |
| `updated_at` | TIMESTAMP | Last update time | Auto |

---

## 🎯 Using Profiles in Your App

### Already Implemented in Profile Page
The profile page (`src/app/profile/page.js`) now:
- ✅ Fetches profile data from `profiles` table
- ✅ Updates both auth metadata AND profiles table
- ✅ Allows editing bio and website
- ✅ Shows character count for bio (500 max)
- ✅ Displays all profile information

### Helper Functions Available
File: `src/lib/supabase/profiles.js`

```javascript
import { getUserProfile, updateProfile, getAllProfiles } from '@/lib/supabase/profiles'

// Get a user's profile
const profile = await getUserProfile(userId)

// Update profile
await updateProfile(userId, { bio: 'New bio', website: 'https://example.com' })

// Get all profiles
const profiles = await getAllProfiles(10) // limit 10
```

---

## ✅ Checklist

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Paste and run QUICK_SETUP.sql
- [ ] Verify with `SELECT * FROM profiles`
- [ ] Test by signing up a new user
- [ ] Check profile appears in Table Editor
- [ ] Visit /profile page and update your bio
- [ ] Verify changes save correctly

---

## 🆘 Troubleshooting

### Problem: "relation profiles does not exist"
**Solution**: You haven't run the SQL yet. Follow Step 1-3 above.

### Problem: "permission denied for table profiles"
**Solution**: Make sure you ran ALL the SQL including the GRANT statements.

### Problem: Profile not created automatically
**Solution**: 
1. Check if triggers exist: Go to Database → Triggers in Supabase
2. You should see: `on_auth_user_created` and `on_auth_user_updated`
3. If missing, re-run the QUICK_SETUP.sql

### Problem: Can't update profile
**Solution**: Make sure you're logged in and trying to update YOUR OWN profile.

### Problem: Getting RLS policy errors
**Solution**: Check Authentication status in Supabase → Authentication → Policies

---

## 🎨 Next Steps (Optional Enhancements)

### Add More Fields
```sql
ALTER TABLE profiles ADD COLUMN location TEXT;
ALTER TABLE profiles ADD COLUMN company TEXT;
ALTER TABLE profiles ADD COLUMN twitter_handle TEXT;
```

### Add Username (Unique)
```sql
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
CREATE INDEX profiles_username_idx ON profiles(username);
```

### Enable Realtime
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

Then in your app:
```javascript
import { subscribeToProfile } from '@/lib/supabase/profiles'

const channel = subscribeToProfile(userId, (payload) => {
  console.log('Profile updated:', payload)
})
```

---

## 📚 Documentation
- Full setup details: `PROFILES_TABLE_SETUP.md`
- SQL migration: `supabase/migrations/001_create_profiles_table.sql`
- Quick setup: `supabase/QUICK_SETUP.sql`
- Helper functions: `src/lib/supabase/profiles.js`

---

**Need help?** Check the full documentation in `PROFILES_TABLE_SETUP.md`
