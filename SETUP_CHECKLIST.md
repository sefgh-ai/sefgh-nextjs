# ✅ Profiles Table Setup Checklist

## 📋 Setup Phase

### Step 1: Understand the System
- [ ] Read `SETUP_INSTRUCTIONS.md` (5 minutes)
- [ ] Review `PROFILES_ARCHITECTURE.md` (optional - for understanding)
- [ ] Check `PROFILES_IMPLEMENTATION_SUMMARY.md` (quick overview)

### Step 2: Run SQL Setup
- [ ] Open https://supabase.com/dashboard
- [ ] Navigate to your project
- [ ] Go to SQL Editor (left sidebar)
- [ ] Click "New Query"
- [ ] Open `supabase/QUICK_SETUP.sql`
- [ ] Copy ALL content (Ctrl+A, Ctrl+C)
- [ ] Paste into SQL Editor
- [ ] Click "Run" or press Ctrl+Enter
- [ ] Verify: ✅ "Success. No rows returned" message

### Step 3: Verify Database
- [ ] Go to Table Editor in Supabase
- [ ] Check that `profiles` table exists
- [ ] Run test query: `SELECT * FROM profiles LIMIT 5;`
- [ ] Go to Database → Triggers
- [ ] Verify triggers exist:
  - [ ] `on_auth_user_created`
  - [ ] `on_auth_user_updated`
  - [ ] `update_profiles_updated_at`

### Step 4: Test with New User
- [ ] Start your app: `npm run dev`
- [ ] Go to: http://localhost:3000/signup
- [ ] Sign up with a NEW test user
- [ ] Check Supabase Dashboard → Table Editor → profiles
- [ ] Verify: Profile row created automatically ✅

---

## 🧪 Testing Phase

### Authentication Tests
- [ ] Sign up creates profile automatically
- [ ] Sign in doesn't create duplicate profile
- [ ] User metadata syncs to profile
- [ ] Email appears in profile table

### Profile Page Tests
- [ ] Visit /profile page while logged in
- [ ] Back button works
- [ ] Avatar displays correctly
- [ ] Full name shows correctly
- [ ] Email shows correctly (disabled field)
- [ ] Bio field is editable
- [ ] Website field is editable
- [ ] Character counter shows for bio (0/500)

### Update Tests
- [ ] Update full name → Saves successfully
- [ ] Update bio → Saves successfully
- [ ] Update website → Saves successfully
- [ ] Toast notification appears on save
- [ ] Refresh page → Changes persist
- [ ] Check Supabase → Data saved correctly

### Security Tests (RLS)
- [ ] Logged out user can view profiles
- [ ] Logged in user can view all profiles
- [ ] User can update own profile
- [ ] User CANNOT update another user's profile
  - [ ] Try in console: Should fail with RLS error
- [ ] User CANNOT delete another user's profile

---

## 🔒 Security Verification

### RLS Policies Check
Go to Supabase → Authentication → Policies → profiles table

- [ ] Policy exists: "Public profiles are viewable by everyone"
  - [ ] Command: SELECT
  - [ ] Using: true

- [ ] Policy exists: "Users can insert own profile"
  - [ ] Command: INSERT
  - [ ] With check: auth.uid() = id

- [ ] Policy exists: "Users can update own profile"
  - [ ] Command: UPDATE
  - [ ] Using: auth.uid() = id

- [ ] Policy exists: "Users can delete own profile"
  - [ ] Command: DELETE
  - [ ] Using: auth.uid() = id

### Test in Browser Console
```javascript
// Should work (read all profiles)
const { data, error } = await supabase
  .from('profiles')
  .select('*')

// Should work (update own profile)
const { data, error } = await supabase
  .from('profiles')
  .update({ bio: 'Test' })
  .eq('id', user.id)

// Should FAIL (update someone else's profile)
const { data, error } = await supabase
  .from('profiles')
  .update({ bio: 'Hacked!' })
  .eq('id', 'different-user-id')
// Expected: error with RLS policy violation
```

---

## 🎨 UI/UX Checks

### Layout & Design
- [ ] Profile page has gradient background
- [ ] Back button visible and clickable
- [ ] Avatar displays with correct size (24x24)
- [ ] Cards have proper spacing
- [ ] Form fields aligned correctly
- [ ] Icons display next to inputs
- [ ] Buttons styled correctly

### Responsive Design
- [ ] Test on mobile (narrow screen)
- [ ] Test on tablet (medium screen)
- [ ] Test on desktop (wide screen)
- [ ] Avatar centers on mobile
- [ ] Form stacks properly on mobile

### Dark Mode
- [ ] Switch to dark mode
- [ ] All text readable
- [ ] Cards have proper contrast
- [ ] Inputs visible
- [ ] Buttons visible

### Loading States
- [ ] Loading spinner shows on page load
- [ ] Skeleton or placeholder while fetching
- [ ] "Saving..." appears when updating
- [ ] Button disabled during save

### Error Handling
- [ ] Toast shows on save success ✅
- [ ] Toast shows on save error ❌
- [ ] Network error handled gracefully
- [ ] Invalid URL in website shows error

---

## 📊 Data Verification

### Supabase Dashboard Checks
- [ ] Go to Table Editor → profiles
- [ ] Verify columns exist:
  - [ ] id (uuid)
  - [ ] email (text)
  - [ ] full_name (text)
  - [ ] avatar_url (text)
  - [ ] bio (text)
  - [ ] website (text)
  - [ ] created_at (timestamp)
  - [ ] updated_at (timestamp)

### Data Integrity
- [ ] id matches auth.users.id
- [ ] email matches auth.users.email
- [ ] full_name syncs with auth metadata
- [ ] updated_at changes on update
- [ ] created_at doesn't change

### Auto-Sync Verification
- [ ] Update name in profile page → Check auth.users
- [ ] Update metadata via Supabase Auth → Check profiles table
- [ ] Delete user → Profile deleted too (CASCADE)

---

## 🔧 Helper Functions Tests

### Test src/lib/supabase/profiles.js

```javascript
// Import functions
import {
  getUserProfile,
  getAllProfiles,
  updateProfile,
  searchProfiles,
  subscribeToProfile
} from '@/lib/supabase/profiles'

// Test getUserProfile
const profile = await getUserProfile(userId)
// ✅ Returns profile object or null

// Test getAllProfiles
const profiles = await getAllProfiles(10)
// ✅ Returns array of profiles

// Test updateProfile
await updateProfile(userId, { bio: 'Test', website: 'https://test.com' })
// ✅ Updates successfully

// Test searchProfiles
const results = await searchProfiles('john')
// ✅ Returns matching profiles

// Test subscribeToProfile
const channel = subscribeToProfile(userId, (payload) => {
  console.log('Updated:', payload)
})
// ✅ Logs updates in realtime
```

---

## 🚀 Production Readiness

### Performance
- [ ] Queries use indexes (profiles_id_idx exists)
- [ ] No N+1 query problems
- [ ] Pagination implemented for large datasets
- [ ] Images optimized (avatar)

### Error Handling
- [ ] Network errors caught and displayed
- [ ] Database errors handled gracefully
- [ ] User-friendly error messages
- [ ] Console logging for debugging

### User Experience
- [ ] Fast page load (<2 seconds)
- [ ] Smooth transitions
- [ ] Clear feedback on actions
- [ ] Intuitive navigation

### Documentation
- [ ] Setup instructions clear
- [ ] Helper functions documented
- [ ] Code comments added
- [ ] README updated

---

## 🎯 Optional Enhancements

### Future Features (Not Required)
- [ ] Add username field (unique)
- [ ] Add profile picture upload
- [ ] Add social media links
- [ ] Add location field
- [ ] Add company field
- [ ] Add profile completeness indicator
- [ ] Add profile views counter
- [ ] Add follow/followers system
- [ ] Add profile privacy settings
- [ ] Add profile verification badge

### Advanced Features
- [ ] Enable realtime subscriptions
- [ ] Add profile search page
- [ ] Add public profile view (/@username)
- [ ] Add profile sharing (Open Graph)
- [ ] Add profile export
- [ ] Add profile analytics

---

## 📝 Final Review

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] Code formatted properly
- [ ] No unused imports
- [ ] No duplicate code

### Git Commit
- [ ] All files staged
- [ ] Meaningful commit message
- [ ] Changes tested locally
- [ ] Ready to push

### Documentation
- [ ] All setup files present
- [ ] Instructions tested
- [ ] Screenshots added (optional)
- [ ] Team informed

---

## ✅ Sign Off

**Date Completed**: _________________

**Tested By**: _________________

**Issues Found**: 
- [ ] None - All working ✅
- [ ] Minor issues (list below)
- [ ] Major issues (list below)

**Notes**:
```
_____________________________________________
_____________________________________________
_____________________________________________
```

**Status**: 
- [ ] ✅ Ready for Production
- [ ] ⚠️ Needs Minor Fixes
- [ ] ❌ Needs Major Work

---

## 🆘 Troubleshooting

If you checked a box and it failed, refer to:
- `SETUP_INSTRUCTIONS.md` → Step-by-step guide
- `PROFILES_TABLE_SETUP.md` → Detailed documentation
- `PROFILES_ARCHITECTURE.md` → System architecture

Common issues:
1. **Table doesn't exist** → Run QUICK_SETUP.sql
2. **RLS errors** → Check policies in Supabase
3. **Profile not created** → Check triggers exist
4. **Can't update** → Verify user is logged in
5. **Textarea error** → Run `npx shadcn@latest add textarea`

---

**Need help?** Check the documentation files or open an issue.
