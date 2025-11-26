-- =====================================================
-- AVATAR STORAGE BUCKET SETUP
-- =====================================================
-- This script sets up the Supabase storage infrastructure
-- for profile picture uploads in SEFGH.
--
-- PREREQUISITES:
-- 1. Create storage bucket via Supabase Dashboard:
--    - Name: avatars
--    - Public: YES (required for public URL access)
--    - File size limit: 5242880 bytes (5MB)
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
--
-- 2. After creating bucket, run this SQL in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE PROFILES TABLE
-- =====================================================
-- Stores user profile information including avatar URL

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  bio TEXT,
  website TEXT,
  avatar_url TEXT,
  email TEXT,
  github_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 2: PROFILES TABLE RLS POLICIES
-- =====================================================

-- Policy 1: Users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- STEP 3: PROFILES TABLE TRIGGERS
-- =====================================================

-- Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- =====================================================
-- STEP 4: STORAGE BUCKET RLS POLICIES
-- =====================================================
-- IMPORTANT: These policies apply to the 'avatars' storage bucket
-- Make sure you created the bucket in Supabase Dashboard first!

-- Policy 1: Users can upload their own avatars
-- File path format: {user_id}/avatar-{timestamp}.{ext}
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Anyone can view avatars (public read)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Policy 3: Users can update their own avatars
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users can delete their own avatars
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- STEP 5: CREATE INITIAL PROFILES FOR EXISTING USERS
-- =====================================================
-- This creates profile entries for any existing auth users

INSERT INTO public.profiles (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email) as full_name
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = users.id
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify everything is set up correctly:

-- Check if profiles table exists and has RLS enabled
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename = 'profiles';

-- Check profiles table policies
-- SELECT policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'profiles';

-- Check storage bucket policies
-- SELECT policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'objects' AND qual LIKE '%avatars%';

-- Check your profile entry
-- SELECT * FROM public.profiles WHERE id = auth.uid();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- You can now upload profile pictures via the app.
-- Supported formats: JPG, PNG, GIF, WebP (max 5MB)
-- =====================================================
