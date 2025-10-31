# Supabase Profiles Table Setup Guide

## 📋 Overview
This guide explains how to set up a `profiles` table in Supabase that automatically syncs with the `auth.users` table and is accessible via the anon key with proper Row Level Security (RLS).

## 🗄️ Table Structure

The `profiles` table includes:
- **id**: UUID (Primary Key, references auth.users)
- **email**: TEXT (synced from auth)
- **full_name**: TEXT (synced from user metadata)
- **avatar_url**: TEXT (synced from user metadata)
- **bio**: TEXT (editable by user)
- **website**: TEXT (editable by user)
- **created_at**: TIMESTAMP (auto-generated)
- **updated_at**: TIMESTAMP (auto-updated)

## 🔒 Row Level Security (RLS) Policies

### 1. **Public Read Access**
   - Everyone can view all profiles (good for public profile pages)
   - Users can discover other users

### 2. **Authenticated Write Access**
   - Users can only insert their own profile
   - Users can only update their own profile
   - Users can only delete their own profile

## 🔄 Auto-Sync Features

### Triggers Implemented:
1. **on_auth_user_created**: Automatically creates a profile when a new user signs up
2. **on_auth_user_updated**: Automatically updates profile when auth user metadata changes
3. **update_profiles_updated_at**: Automatically updates the `updated_at` timestamp

## 📝 Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project**: https://supabase.com/dashboard
2. **Navigate to SQL Editor** (left sidebar)
3. **Click "New Query"**
4. **Copy and paste** the entire content from `supabase/migrations/001_create_profiles_table.sql`
5. **Click "Run"** to execute the SQL

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Initialize Supabase in your project (if not done)
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

## ✅ Verification Steps

After running the SQL, verify everything is set up correctly:

1. **Check Table Exists**:
   ```sql
   SELECT * FROM public.profiles LIMIT 5;
   ```

2. **Check RLS is Enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'profiles';
   ```

3. **Check Policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

4. **Test Auto-Creation**: Sign up a new user and check if profile is created automatically

## 🔧 Testing the Setup

### Test 1: Sign up a new user
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'secure-password',
  options: {
    data: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }
})
```
✅ A profile should be automatically created

### Test 2: Update user metadata
```javascript
const { data, error } = await supabase.auth.updateUser({
  data: {
    full_name: 'Updated Name',
  }
})
```
✅ The profile should automatically update

### Test 3: Query profiles (anon access)
```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
```
✅ Should return all profiles (public read access)

### Test 4: Update own profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({ bio: 'My bio', website: 'https://mysite.com' })
  .eq('id', user.id)
```
✅ Should update successfully

### Test 5: Try to update someone else's profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({ bio: 'Hacked!' })
  .eq('id', 'someone-else-id')
```
❌ Should fail with RLS error

## 🎯 Usage in Your App

### Fetch User Profile
```javascript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Get specific user profile
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()

// Get all profiles
const { data: profiles, error } = await supabase
  .from('profiles')
  .select('*')
```

### Update User Profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({
    bio: 'Software Developer',
    website: 'https://mywebsite.com'
  })
  .eq('id', user.id)
```

### Listen to Profile Changes (Realtime)
```javascript
const channel = supabase
  .channel('profiles')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'profiles',
      filter: `id=eq.${user.id}`
    }, 
    (payload) => {
      console.log('Profile changed:', payload)
    }
  )
  .subscribe()
```

## 🔐 Security Notes

1. **Anon Key Access**: The anon key can only:
   - Read all profiles (SELECT)
   - Insert/Update/Delete their own profile after authentication

2. **Protected Fields**: Email, full_name, and avatar_url are synced from auth.users (controlled by Supabase Auth)

3. **User-Editable Fields**: bio and website can be edited directly by users

4. **RLS Enforcement**: Even with the service role key, RLS policies are enforced for anon/authenticated roles

## 📊 Database Diagram

```
┌─────────────────┐         ┌──────────────────┐
│   auth.users    │         │  public.profiles │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │────────>│ id (PK, FK)      │
│ email           │         │ email            │
│ raw_user_meta   │         │ full_name        │
│   - full_name   │  sync   │ avatar_url       │
│   - avatar_url  │ ──────> │ bio              │
│ created_at      │         │ website          │
│ updated_at      │         │ created_at       │
└─────────────────┘         │ updated_at       │
                            └──────────────────┘
```

## 🚀 Next Steps

1. Run the SQL migration in Supabase Dashboard
2. Update your profile page to use the `profiles` table
3. Add realtime subscriptions for live updates
4. Consider adding more fields like:
   - `username` (unique)
   - `location`
   - `company`
   - `social_links`

## 🆘 Troubleshooting

**Issue**: Profiles not created automatically
- Check if triggers exist: `SELECT * FROM pg_trigger WHERE tgname LIKE '%auth_user%';`
- Verify function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`

**Issue**: RLS blocking legitimate requests
- Check current user: `SELECT auth.uid();`
- Verify policies: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`

**Issue**: Can't update profile
- Ensure user is authenticated
- Check that user.id matches the profile.id being updated

