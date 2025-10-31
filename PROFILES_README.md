# 🎯 Profiles Table - Quick Start Guide

> **Status**: ✅ Implementation Complete | ⚠️ **SQL Setup Required** (5 minutes)

## 🚀 Get Started in 3 Steps

### 1️⃣ Run SQL Setup (Required!)
```bash
1. Open https://supabase.com/dashboard
2. Go to SQL Editor → New Query
3. Copy from: supabase/QUICK_SETUP.sql
4. Paste and Run
```
**Time**: ~2 minutes

### 2️⃣ Test It
```bash
1. npm run dev
2. Visit http://localhost:3000/signup
3. Sign up a new user
4. Check Supabase → profiles table
```
**Time**: ~2 minutes

### 3️⃣ Use Profile Page
```bash
1. Visit http://localhost:3000/profile
2. Edit your bio and website
3. Click "Save Changes"
```
**Time**: ~1 minute

---

## 📚 Documentation Files

| Priority | File | Purpose | Read Time |
|----------|------|---------|-----------|
| ⭐⭐⭐ | `SETUP_INSTRUCTIONS.md` | **Start here!** Step-by-step setup | 5 min |
| ⭐⭐⭐ | `SETUP_CHECKLIST.md` | Track your progress | 2 min |
| ⭐⭐ | `PROFILES_IMPLEMENTATION_SUMMARY.md` | What was built | 5 min |
| ⭐ | `PROFILES_TABLE_SETUP.md` | Detailed documentation | 10 min |
| ⭐ | `PROFILES_ARCHITECTURE.md` | System architecture | 10 min |

---

## 📁 Important Files

### SQL Files (Run These!)
```
supabase/
├── QUICK_SETUP.sql ⭐⭐⭐ ← Run this in Supabase!
└── migrations/
    └── 001_create_profiles_table.sql (detailed version)
```

### Code Files (Already Implemented!)
```
src/
├── app/
│   └── profile/
│       └── page.js ← Profile page with bio, website
├── lib/
│   └── supabase/
│       └── profiles.js ← Helper functions
└── components/
    └── ui/
        └── textarea.jsx ← Textarea component
```

---

## ✨ What You Get

### 🗄️ Database
- ✅ **profiles table** with auto-sync to auth.users
- ✅ **Row Level Security** for data protection
- ✅ **Auto-sync triggers** (no manual updates needed)
- ✅ **Automatic timestamps** (created_at, updated_at)

### 🎨 UI
- ✅ **Profile page** at `/profile`
- ✅ **Editable fields**: bio (500 chars), website
- ✅ **Read-only fields**: email, full name, avatar
- ✅ **Account info**: ID, verification, last sign in
- ✅ **Activity stats**: Placeholder for future features

### 🔐 Security
- ✅ **Public read** - Anyone can view profiles
- ✅ **Private write** - Users can only edit their own
- ✅ **RLS policies** - Database-level security
- ✅ **Anon key safe** - Proper access control

### 🛠️ Developer Tools
- ✅ **Helper functions** - Reusable profile operations
- ✅ **TypeScript ready** - Add types easily
- ✅ **Realtime support** - Live updates ready
- ✅ **Search ready** - Profile search function included

---

## 🎯 What's Already Done

### ✅ Implemented
1. ✅ Profiles table SQL migration
2. ✅ Auto-sync triggers (auth → profiles)
3. ✅ Row Level Security policies
4. ✅ Profile page UI with form
5. ✅ Bio field (textarea, 500 char limit)
6. ✅ Website field (URL input)
7. ✅ Helper functions (CRUD operations)
8. ✅ Toast notifications
9. ✅ Loading states
10. ✅ Error handling

### ⚠️ Requires Setup
1. ⚠️ Run SQL in Supabase Dashboard (5 minutes)
2. ⚠️ Test with a new user signup
3. ⚠️ Verify in Supabase Table Editor

### 🎨 Optional (Future)
- Add username field
- Add profile picture upload
- Add social media links
- Add profile visibility settings
- Add follow/followers system

---

## 🏗️ Architecture Overview

```
User Signs Up
     ↓
auth.users created
     ↓
🔔 Trigger fires
     ↓
profiles row created automatically
     ↓
User edits profile
     ↓
Updates both:
  • auth metadata (full_name)
  • profiles table (bio, website)
     ↓
✅ Saved!
```

---

## 🔧 Quick Commands

### Install Dependencies (Already Done)
```bash
npx shadcn@latest add textarea
```

### Test Profile Fetch
```javascript
import { getUserProfile } from '@/lib/supabase/profiles'
const profile = await getUserProfile(userId)
```

### Update Profile
```javascript
import { updateProfile } from '@/lib/supabase/profiles'
await updateProfile(userId, { 
  bio: 'Software Developer',
  website: 'https://mysite.com' 
})
```

### Search Profiles
```javascript
import { searchProfiles } from '@/lib/supabase/profiles'
const results = await searchProfiles('john')
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Table doesn't exist | Run `QUICK_SETUP.sql` in Supabase |
| RLS policy error | Check Supabase → Authentication → Policies |
| Profile not created | Check triggers exist in Supabase |
| Can't update profile | Verify user is logged in |
| Textarea error | Run `npx shadcn@latest add textarea` |

**Detailed help**: See `SETUP_INSTRUCTIONS.md` Section "Troubleshooting"

---

## 📖 Usage Examples

### Fetch Current User Profile
```javascript
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile } from '@/lib/supabase/profiles'

export default function MyComponent() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then(setProfile)
    }
  }, [user])

  return <div>{profile?.bio}</div>
}
```

### Update Profile Form
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  
  await updateProfile(user.id, {
    bio: bioValue,
    website: websiteValue
  })
  
  toast.success('Profile updated!')
}
```

### Realtime Profile Updates
```javascript
import { subscribeToProfile } from '@/lib/supabase/profiles'

useEffect(() => {
  const channel = subscribeToProfile(user.id, (payload) => {
    console.log('Profile updated:', payload.new)
    setProfile(payload.new)
  })

  return () => unsubscribeFromProfile(channel)
}, [user])
```

---

## ✅ Checklist

Before using profiles in your app:

- [ ] Read `SETUP_INSTRUCTIONS.md`
- [ ] Run `QUICK_SETUP.sql` in Supabase
- [ ] Verify table exists in Table Editor
- [ ] Test signup → Check profile created
- [ ] Visit `/profile` page
- [ ] Update bio and website
- [ ] Verify changes save correctly
- [ ] Test RLS policies (try updating another user)

**Track progress**: Use `SETUP_CHECKLIST.md`

---

## 🎓 Learning Resources

### Understanding the System
1. Read: `PROFILES_ARCHITECTURE.md` - Visual diagrams
2. Read: `PROFILES_TABLE_SETUP.md` - Detailed docs
3. Check: `src/lib/supabase/profiles.js` - Code examples

### Testing
1. Use: `SETUP_CHECKLIST.md` - Test everything
2. Try: Browser console - Test helper functions
3. Check: Supabase logs - Debug issues

---

## 📞 Support

**Documentation**: All files in project root (*.md)

**Common Issues**: See `SETUP_INSTRUCTIONS.md` → Troubleshooting

**Code Reference**: See `src/lib/supabase/profiles.js`

---

## 🎉 Next Steps

After setup is complete:

1. **Test thoroughly** - Use `SETUP_CHECKLIST.md`
2. **Customize** - Add more fields to profiles table
3. **Extend** - Build profile search, user discovery
4. **Deploy** - Push to production

---

## 📊 Project Status

| Component | Status | File |
|-----------|--------|------|
| SQL Migration | ✅ Ready | `supabase/QUICK_SETUP.sql` |
| Profile Page | ✅ Complete | `src/app/profile/page.js` |
| Helper Functions | ✅ Complete | `src/lib/supabase/profiles.js` |
| Documentation | ✅ Complete | All *.md files |
| Testing Checklist | ✅ Complete | `SETUP_CHECKLIST.md` |
| **Database Setup** | ⚠️ **Required** | **Run SQL in Supabase!** |

---

## 🚀 Quick Links

- **Setup Guide**: `SETUP_INSTRUCTIONS.md` ⭐
- **Checklist**: `SETUP_CHECKLIST.md` ⭐
- **SQL File**: `supabase/QUICK_SETUP.sql` ⭐
- **Summary**: `PROFILES_IMPLEMENTATION_SUMMARY.md`
- **Architecture**: `PROFILES_ARCHITECTURE.md`
- **Full Docs**: `PROFILES_TABLE_SETUP.md`

---

**Ready to start?** → Open `SETUP_INSTRUCTIONS.md` and follow Step 1-5!

**Time to complete**: ~10 minutes
