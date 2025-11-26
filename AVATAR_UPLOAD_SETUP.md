# Profile Picture Upload Setup Guide

## Overview
This guide will help you set up the profile picture upload functionality in SEFGH. The feature supports **JPG, PNG, GIF, and WebP** formats with a maximum file size of **5MB**.

---

## 🚨 Quick Fix for "Internal Server Error"

If you're experiencing upload failures, the most common cause is a **missing storage bucket**. Follow these steps:

### Step 1: Create Storage Bucket in Supabase

1. Go to your **Supabase Dashboard** → **Storage**
2. Click **"New Bucket"**
3. Configure the bucket:
   ```
   Bucket Name: avatars
   Public bucket: ✅ YES (required for public URL access)
   File size limit: 5242880 (5MB in bytes)
   Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
   ```
4. Click **"Create bucket"**

### Step 2: Run SQL Setup Script

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file: `supabase/avatar-storage-setup.sql`
3. Copy the entire SQL script
4. Paste into SQL Editor and click **"Run"**

This will:
- ✅ Create `profiles` table (if it doesn't exist)
- ✅ Set up Row Level Security (RLS) policies
- ✅ Configure storage bucket permissions
- ✅ Create profiles for existing users

### Step 3: Verify Setup

Run these verification queries in SQL Editor:

```sql
-- Check if profiles table exists
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check storage bucket policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' AND qual LIKE '%avatars%';

-- Check your profile entry
SELECT * FROM public.profiles WHERE id = auth.uid();
```

### Step 4: Test Upload

1. Log in to your app
2. Go to **Profile** page
3. Click **"Change Photo"**
4. Select an image file (JPG/PNG/GIF/WebP, under 5MB)
5. Click **"Upload Avatar"**

---

## 📁 File Structure

### Components
- **`src/components/AvatarUpload.jsx`** - Upload UI with drag & drop, preview, validation
- **`src/app/api/upload-avatar/route.js`** - Server-side upload handler

### Database
- **`supabase/avatar-storage-setup.sql`** - Complete setup script
- **Storage Bucket**: `avatars` (must be created manually in dashboard)
- **Database Table**: `profiles` (created by SQL script)

---

## 🔍 How It Works

### Upload Flow

1. **User selects file** → Client validates format (JPG/PNG/GIF/WebP) and size (≤5MB)
2. **Preview displayed** → FileReader generates base64 preview
3. **User clicks Upload** → FormData sent to `/api/upload-avatar`
4. **Server validates** → Re-validates type and size server-side
5. **Delete old avatars** → Removes existing avatars from storage
6. **Upload to Supabase** → Stores in `avatars/{user_id}/avatar-{timestamp}.{ext}`
7. **Get public URL** → Retrieves public URL for the uploaded image
8. **Update metadata** → Updates `auth.users` metadata with avatar URL
9. **Update profiles** → Updates `profiles.avatar_url` field
10. **Return success** → Client displays new avatar

### File Naming Convention

```
avatars/{user_id}/avatar-{timestamp}.{ext}

Example:
avatars/abc123-def-456-ghi/avatar-1735123456789.png
```

This structure:
- ✅ Organizes files by user (one folder per user)
- ✅ Prevents name conflicts with timestamps
- ✅ Enables easy deletion of old avatars
- ✅ Works with RLS policies (user ID in path)

---

## 🔐 Security

### Row Level Security (RLS)

**Profiles Table:**
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

**Storage Bucket:**
- Users can upload to their own folder (`avatars/{user_id}/`)
- Users can update/delete files in their own folder
- All avatars are publicly readable (for display across app)

### Validation

**Client-Side** (`AvatarUpload.jsx`):
```javascript
// File type validation
const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// File size validation
if (file.size > 5 * 1024 * 1024) {
  // Reject files over 5MB
}
```

**Server-Side** (`route.js`):
```javascript
// Double validation to prevent bypassing client checks
const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
if (!validTypes.includes(file.type)) {
  return error
}

if (file.size > 5 * 1024 * 1024) {
  return error
}
```

---

## 🐛 Debugging

### Enhanced Error Logging

The upload API now includes detailed error logging with emoji indicators:

- **❌** - Critical errors that prevent upload
- **⚠️** - Non-critical warnings (e.g., profiles table missing)
- **✅** - Success messages
- **ℹ️** - Informational notes

### Common Issues

#### 1. "Internal server error" / Upload fails silently

**Cause:** Storage bucket `avatars` doesn't exist  
**Solution:** Follow Step 1 above to create the bucket

**Check console logs for:**
```
❌ Avatar upload failed: {
  message: "Bucket not found",
  ...
}
```

#### 2. "Storage bucket not configured" error message

**Cause:** Bucket detection failed  
**Solution:** 
1. Verify bucket is named exactly `avatars` (case-sensitive)
2. Ensure bucket is marked as **public**
3. Re-run SQL setup script

#### 3. Upload succeeds but avatar doesn't display

**Cause:** Bucket is not public  
**Solution:**
1. Go to **Supabase Dashboard** → **Storage** → **avatars**
2. Click **Settings**
3. Enable **"Public bucket"**
4. Re-upload avatar

#### 4. "Failed to update user profile" error

**Cause:** Auth metadata update failed  
**Check:**
- User is authenticated
- Valid Supabase session
- Network connectivity

#### 5. Profiles table warning (non-critical)

**Log message:**
```
⚠️ Profiles table update failed (non-critical)
ℹ️ Note: If profiles table does not exist, run supabase/avatar-storage-setup.sql
```

**Cause:** `profiles` table doesn't exist  
**Impact:** Avatar still works, but won't sync to profiles table  
**Solution:** Run SQL setup script (Step 2)

### Debugging Commands

Add to browser console on profile page:

```javascript
// Check current user
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)

// Check storage buckets
const { data: buckets } = await supabase.storage.listBuckets()
console.log('Available buckets:', buckets)

// Check profile data
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
console.log('Profile:', profile)

// List user's avatars
const { data: files } = await supabase.storage
  .from('avatars')
  .list(user.id)
console.log('User avatars:', files)
```

---

## 📊 Supabase Dashboard Checks

### Storage Tab
- Navigate to **Storage** → **avatars**
- You should see folders named with user IDs
- Each folder contains `avatar-{timestamp}.{ext}` files

### SQL Editor Queries

```sql
-- View all profiles with avatars
SELECT id, email, avatar_url, created_at 
FROM public.profiles 
WHERE avatar_url IS NOT NULL;

-- Count total uploaded avatars
SELECT COUNT(*) 
FROM storage.objects 
WHERE bucket_id = 'avatars';

-- View storage policies
SELECT * 
FROM pg_policies 
WHERE tablename = 'objects' AND qual LIKE '%avatars%';

-- Check profiles table structure
\d public.profiles
```

---

## 🎨 Supported Formats

| Format | MIME Type | Max Size | Notes |
|--------|-----------|----------|-------|
| **JPEG** | `image/jpeg` | 5MB | Most common, good compression |
| **PNG** | `image/png` | 5MB | Supports transparency |
| **GIF** | `image/gif` | 5MB | Supports animation |
| **WebP** | `image/webp` | 5MB | Modern format, best compression |

---

## 🔧 Advanced Configuration

### Increase File Size Limit

**Client-Side** (`src/components/AvatarUpload.jsx` line 30):
```javascript
if (file.size > 10 * 1024 * 1024) { // Change to 10MB
```

**Server-Side** (`src/app/api/upload-avatar/route.js` line 38):
```javascript
if (file.size > 10 * 1024 * 1024) { // Change to 10MB
```

**Supabase Bucket:**
1. Dashboard → Storage → avatars → Settings
2. Change **File size limit** to `10485760` (10MB in bytes)

### Add More File Formats

**Both client and server** (arrays on lines 22 and 28):
```javascript
const validTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',  // Add SVG
  'image/bmp'       // Add BMP
]
```

**Supabase Bucket:**
1. Dashboard → Storage → avatars → Settings
2. Update **Allowed MIME types**

### Change Storage Path Pattern

**API Route** (`src/app/api/upload-avatar/route.js` line 47):
```javascript
// Current: avatars/{user_id}/avatar-{timestamp}.{ext}
const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

// Alternative: avatars/{user_id}.{ext} (single file per user)
const fileName = `${user.id}.${fileExt}`

// Alternative: avatars/{year}/{month}/{user_id}-{timestamp}.{ext}
const date = new Date()
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, '0')
const fileName = `${year}/${month}/${user.id}-${Date.now()}.${fileExt}`
```

**Update RLS policies accordingly!**

---

## ✅ Checklist

Before reporting issues, verify:

- [ ] Storage bucket `avatars` exists in Supabase Dashboard
- [ ] Bucket is marked as **public**
- [ ] File size limit is `5242880` bytes (5MB)
- [ ] Allowed MIME types include: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- [ ] SQL setup script (`avatar-storage-setup.sql`) has been run
- [ ] `profiles` table exists (check in Table Editor)
- [ ] RLS is enabled on `profiles` table
- [ ] Storage policies exist (4 policies on `storage.objects`)
- [ ] User is authenticated (check browser console)
- [ ] Browser console shows detailed error logs (if upload fails)

---

## 📞 Support

If issues persist after following this guide:

1. **Check browser console** for detailed error logs (with emoji indicators)
2. **Check Supabase logs** (Dashboard → Logs → Edge Functions)
3. **Verify SQL script** ran without errors
4. **Test with different file** (small PNG, ~500KB)
5. **Clear browser cache** and try again

---

## 🎉 Success Indicator

When everything is configured correctly, you'll see:

**Browser Console:**
```
✅ Avatar upload successful: {
  userId: "...",
  fileName: "...",
  publicUrl: "https://..."
}
```

**Profile Page:**
- Avatar displays immediately after upload
- No error toasts
- "Change Photo" button remains functional

---

*Last Updated: November 26, 2025*
