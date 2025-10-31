# Supabase Authentication Setup

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Create a new project (give it a name and password)

### 2. Get Your Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 3. Configure Environment Variables
1. Create a `.env.local` file in the root of your project
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with your actual values.

### 4. Enable OAuth Providers (Optional)

#### For GitHub OAuth:
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable GitHub
3. Create a GitHub OAuth App:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Set Authorization callback URL to: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

#### For Google OAuth:
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable Google
3. Create Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### 5. Restart Your Development Server
```bash
npm run dev
```

## Features Implemented

✅ **Email/Password Authentication**
- Sign up with email and password
- Login with email and password
- Email verification
- Password reset (coming soon)

✅ **OAuth Authentication**
- GitHub login
- Google login

✅ **User Experience**
- Loading states
- Error handling
- Success messages
- Automatic redirects

✅ **Security**
- Session management
- Cookie-based authentication
- Middleware for auth state

## Usage

### Sign Up
Visit `/signup` to create a new account

### Login
Visit `/login` to sign in

### Protected Routes
Add auth checks to protect routes (example coming soon)

## Next Steps

1. Add logout functionality
2. Add user profile page
3. Protect routes that require authentication
4. Add password reset functionality
5. Customize email templates in Supabase

## Troubleshooting

**Issue**: OAuth not working
- Check that redirect URLs match exactly in OAuth provider settings
- Verify Supabase OAuth provider is enabled

**Issue**: Email signup not working
- Check if email confirmation is required in Supabase settings
- Verify SMTP settings if using custom email

**Issue**: Session not persisting
- Check middleware.js is configured correctly
- Verify environment variables are set
