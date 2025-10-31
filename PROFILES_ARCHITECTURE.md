# 🗺️ Profiles Table Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR APPLICATION                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Profile Page (/profile)                                            │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  1. User edits bio and website                             │     │
│  │  2. Clicks "Save Changes"                                  │     │
│  │  3. App updates both:                                       │     │
│  │     • supabase.auth.updateUser() for full_name            │     │
│  │     • profiles table for bio, website                      │     │
│  └───────────────────────────────────────────────────────────┘     │
│                           │                                           │
│                           ▼                                           │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐         ┌──────────────────────┐          │
│  │   auth.users        │         │  public.profiles     │          │
│  ├─────────────────────┤         ├──────────────────────┤          │
│  │ id                  │────────▶│ id (FK)              │          │
│  │ email               │    │    │ email                │          │
│  │ raw_user_meta_data  │    │    │ full_name            │          │
│  │   ├─ full_name      │    │    │ avatar_url           │          │
│  │   └─ avatar_url     │    │    │ bio           ✏️     │          │
│  │ created_at          │    │    │ website       ✏️     │          │
│  │ updated_at          │    │    │ created_at           │          │
│  └─────────────────────┘    │    │ updated_at           │          │
│           │                  │    └──────────────────────┘          │
│           │                  │                                       │
│           │ ON INSERT        │ CASCADE DELETE                        │
│           ▼                  │                                       │
│  ┌──────────────────────────┘                                       │
│  │ TRIGGER: on_auth_user_created                                    │
│  │ ↓                                                                 │
│  │ handle_new_user()                                                │
│  │ • Creates profile automatically                                  │
│  │ • Copies: id, email, full_name, avatar_url                       │
│  └──────────────────────────────────────────────────────────────────┤
│                                                                       │
│           │ ON UPDATE                                                │
│           ▼                                                           │
│  ┌──────────────────────────────────────────────────────────────────┤
│  │ TRIGGER: on_auth_user_updated                                    │
│  │ ↓                                                                 │
│  │ handle_user_update()                                             │
│  │ • Updates profile automatically                                  │
│  │ • Syncs: email, full_name, avatar_url                            │
│  └──────────────────────────────────────────────────────────────────┤
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 🟢 User Sign Up Flow
```
User fills signup form
        ↓
supabase.auth.signUp({
  email: "user@example.com",
  password: "********",
  options: {
    data: {
      full_name: "John Doe"
    }
  }
})
        ↓
auth.users row created
        ↓
🔔 TRIGGER: on_auth_user_created fires
        ↓
handle_new_user() function executes
        ↓
INSERT INTO profiles (
  id,
  email,
  full_name,
  avatar_url
) VALUES (...)
        ↓
✅ Profile created automatically!
```

### 🔄 User Update Flow
```
User updates profile in /profile page
        ↓
supabase.auth.updateUser({
  data: { full_name: "Jane Doe" }
})
        ↓
auth.users.raw_user_meta_data updated
        ↓
🔔 TRIGGER: on_auth_user_updated fires
        ↓
handle_user_update() function executes
        ↓
UPDATE profiles SET
  full_name = 'Jane Doe',
  updated_at = NOW()
WHERE id = user.id
        ↓
✅ Profile synced automatically!

PLUS (user can also update directly):
        ↓
supabase
  .from('profiles')
  .update({ bio: '...', website: '...' })
        ↓
✅ Bio and website updated!
```

### 🔒 Row Level Security Flow
```
User A tries to read profiles
        ↓
SELECT * FROM profiles
        ↓
RLS Policy: "Public profiles are viewable"
        ↓
USING (true) ← Always allows
        ↓
✅ Returns all profiles
```

```
User A tries to update User B's profile
        ↓
UPDATE profiles SET bio = 'hacked'
WHERE id = userB_id
        ↓
RLS Policy: "Users can update own profile"
        ↓
USING (auth.uid() = id)
        ↓
auth.uid() = userA_id
id = userB_id
userA_id ≠ userB_id
        ↓
❌ UPDATE BLOCKED!
```

```
User A tries to update own profile
        ↓
UPDATE profiles SET bio = 'My new bio'
WHERE id = userA_id
        ↓
RLS Policy: "Users can update own profile"
        ↓
USING (auth.uid() = id)
        ↓
auth.uid() = userA_id
id = userA_id
userA_id = userA_id ✅
        ↓
✅ UPDATE ALLOWED!
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Profile Page Component                    │
│                  (src/app/profile/page.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  useAuth() ──────────────────┐                              │
│    │                          │                              │
│    ├─ user                    │                              │
│    ├─ loading                 │                              │
│    └─ signOut                 │                              │
│                               │                              │
│  useState() ─────────────────┤                              │
│    ├─ fullName                │                              │
│    ├─ email                   │                              │
│    ├─ bio         ✏️          │                              │
│    ├─ website     ✏️          │                              │
│    └─ profile                 │                              │
│                               │                              │
│  useEffect() ────────────────┤                              │
│    └─ fetchProfile()          │                              │
│       ↓                       │                              │
│       SELECT * FROM profiles  │                              │
│       WHERE id = user.id      │                              │
│                               │                              │
│  handleUpdateProfile() ───────┤                              │
│    ├─ updateUser()            │ ← Updates auth metadata      │
│    └─ update profiles         │ ← Updates bio, website       │
│                               │                              │
│  Components Used:             │                              │
│    ├─ Header                  │                              │
│    ├─ Card                    │                              │
│    ├─ Avatar                  │                              │
│    ├─ Input                   │                              │
│    ├─ Textarea        ✏️      │                              │
│    ├─ Button                  │                              │
│    └─ Separator               │                              │
└─────────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                     RELATIONSHIPS                             │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  auth.users (1) ───────────────────── (1) profiles           │
│                                                                │
│  • One user has exactly one profile                           │
│  • Profile.id REFERENCES auth.users(id)                       │
│  • ON DELETE CASCADE (delete profile if user deleted)         │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Authentication (Supabase Auth)                        │
│  ├─ User must be logged in                                      │
│  └─ JWT token required                                          │
│                                                                  │
│  Layer 2: Row Level Security (PostgreSQL)                       │
│  ├─ SELECT: Everyone (public read)                              │
│  ├─ INSERT: Only own profile (auth.uid() = id)                  │
│  ├─ UPDATE: Only own profile (auth.uid() = id)                  │
│  └─ DELETE: Only own profile (auth.uid() = id)                  │
│                                                                  │
│  Layer 3: Application Logic                                     │
│  ├─ Form validation                                             │
│  ├─ Character limits (bio: 500 chars)                           │
│  ├─ URL validation (website)                                    │
│  └─ Error handling                                              │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## API Usage Pattern

```javascript
// ──────────────────────────────────────────────────────────
// PATTERN 1: Fetch Profile
// ──────────────────────────────────────────────────────────

import { getUserProfile } from '@/lib/supabase/profiles'

const profile = await getUserProfile(userId)
// Returns: { id, email, full_name, avatar_url, bio, website, ... }


// ──────────────────────────────────────────────────────────
// PATTERN 2: Update Profile
// ──────────────────────────────────────────────────────────

// Step 1: Update auth metadata (full_name, avatar_url)
await supabase.auth.updateUser({
  data: { full_name: newName }
})

// Step 2: Update profile table (bio, website)
await updateProfile(userId, {
  bio: newBio,
  website: newWebsite
})


// ──────────────────────────────────────────────────────────
// PATTERN 3: Search Profiles
// ──────────────────────────────────────────────────────────

import { searchProfiles } from '@/lib/supabase/profiles'

const results = await searchProfiles('john')
// Returns: All profiles with 'john' in name or email


// ──────────────────────────────────────────────────────────
// PATTERN 4: Realtime Updates
// ──────────────────────────────────────────────────────────

import { subscribeToProfile } from '@/lib/supabase/profiles'

const channel = subscribeToProfile(userId, (payload) => {
  console.log('Profile updated:', payload.new)
  // Update your UI here
})

// Cleanup when component unmounts
return () => unsubscribeFromProfile(channel)
```

## File Structure

```
sefgh-nextjs/
│
├── src/
│   ├── app/
│   │   └── profile/
│   │       └── page.js ──────────► Profile page UI
│   │
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.js ────────► Browser client
│   │       ├── server.js ────────► Server client
│   │       └── profiles.js ──────► Helper functions ⭐
│   │
│   └── contexts/
│       └── AuthContext.js ───────► Global auth state
│
├── supabase/
│   ├── migrations/
│   │   └── 001_create_profiles_table.sql ──► Full migration
│   └── QUICK_SETUP.sql ──────────────────────► Quick setup ⭐
│
├── SETUP_INSTRUCTIONS.md ───────────────────► Start here! ⭐
├── PROFILES_TABLE_SETUP.md ─────────────────► Full docs
├── PROFILES_IMPLEMENTATION_SUMMARY.md ──────► Summary
└── PROFILES_ARCHITECTURE.md ───────────────► This file
```

## Quick Reference

### Must Do First ⚠️
```bash
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run: supabase/QUICK_SETUP.sql
4. Verify: SELECT * FROM profiles;
```

### Common Operations
```javascript
// Get profile
const profile = await getUserProfile(userId)

// Update profile
await updateProfile(userId, { bio, website })

// Search
const results = await searchProfiles('term')

// Subscribe
const channel = subscribeToProfile(userId, callback)
```

### RLS Rules
```
READ:   ✅ Everyone
CREATE: ✅ Own profile only
UPDATE: ✅ Own profile only
DELETE: ✅ Own profile only
```

---

**Legend:**
- ✏️ = User editable field
- ⭐ = Important file
- ⚠️ = Required action
- ✅ = Allowed operation
- ❌ = Blocked operation
