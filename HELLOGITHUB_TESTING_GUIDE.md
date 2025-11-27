# HelloGitHub Testing Guide

## Quick Start Testing

### 1. Database Setup (REQUIRED FIRST)
```sql
-- Go to Supabase SQL Editor
-- Run the complete schema from: supabase/repo-details-schema.sql
-- This creates 8 tables:
-- ✓ repo_votes
-- ✓ repo_ratings  
-- ✓ repo_comments
-- ✓ comment_votes
-- ✓ repo_claims
-- ✓ repo_collections
-- ✓ repo_videos
-- ✓ Plus views and triggers
```

**IMPORTANT**: Without running this schema, none of the features will work!

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Test Flow

#### Step 1: Search for Repository
1. Go to http://localhost:3000/search
2. Search for "react" or any repository
3. Click on any repository card

**Expected**: Should navigate to `/repo/[owner]/[repo-name]`

#### Step 2: Test Repository Details Page
**Expected to see**:
- ✓ Repository header with stats (stars, forks, issues)
- ✓ Action buttons: Visit GitHub, View README & Code, Save, Discuss, QR icon
- ✓ Vote arrows (up/down) on left side
- ✓ Three tabs: Description, Ratings, Video
- ✓ Comments section at bottom

#### Step 3: Test Voting
1. **Click upvote arrow** (must be logged in)
   - Arrow should turn blue/highlighted
   - Vote count should increase by 1
   - Toast notification: "Upvoted!"

2. **Click upvote again** (remove vote)
   - Arrow should return to normal
   - Vote count should decrease by 1
   - Toast notification: "Vote removed"

3. **Click downvote arrow**
   - Arrow should turn red/highlighted
   - Vote count should decrease
   - Toast notification: "Downvoted!"

**Console Check**: Open DevTools → Console
- Should see: "Vote registered successfully"
- No errors about missing tables

#### Step 4: Test Save/Collect Feature
1. **Click "Save" button** (must be logged in)
   - Button should change to "Saved"
   - Save count should increase
   - Button should have filled bookmark icon
   - Toast notification: "Added to collection!"

2. **Click "Saved" button again**
   - Button should change back to "Save"
   - Save count should decrease
   - Button should have outline bookmark icon
   - Toast notification: "Removed from collection"

**Console Check**:
- Should see: Successful fetch from /api/repo/collect
- No 404 errors

#### Step 5: Test Video Tab
1. **Click "Video" tab**
   - Should see "Add Video" button
   - Empty state if no videos

2. **Click "Add Video"**
   - Form should appear with video URL input
   - Optional: title and description fields

3. **Paste YouTube URL** (example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
   - Click "Add Video"
   - Video should appear with:
     - YouTube thumbnail
     - Play button overlay
     - Title (if provided)
     - Delete button

4. **Click video thumbnail**
   - YouTube video should play in embed

5. **Click delete button** (trash icon)
   - Video should disappear
   - Toast notification: "Video deleted"

**Console Check**:
- Should see: Video extracted YouTube ID
- Thumbnail URL generated
- No CORS errors

#### Step 6: Test Comments
1. **Type a comment** in textarea at bottom
   - Click "Post Comment"
   - Comment should appear at top of list
   - Should show your username
   - Should show "just now" timestamp
   - Should have Reply, Edit, Delete buttons

2. **Click "Reply"** on your comment
   - Reply form should appear indented
   - Type reply and click "Post Reply"
   - Reply should appear nested under parent
   - Should have left border indicating nesting

3. **Test comment voting**
   - Click upvote on a comment
   - Vote count should increase
   - Arrow should highlight
   - Click downvote
   - Should switch vote and update count

4. **Test edit comment**
   - Click "Edit" on your comment
   - Textarea should appear with existing text
   - Modify text and click "Save"
   - Comment should update
   - Should show "(edited)" tag

5. **Test delete comment**
   - Click "Delete" on your comment
   - Confirmation dialog should appear
   - Click confirm
   - Comment should show "[deleted]"
   - Username should change to "deleted user"

**Console Check**:
- Should see: Comment posted successfully
- No errors about parent_id or nesting level

#### Step 7: Test QR Code
1. **Click QR icon button** (top right, next to "Discuss")
   - Modal should open
   - QR code should generate automatically
   - Should see repository URL below QR code

2. **Click "Download QR Code"**
   - PNG file should download
   - Filename: `repo-qr-code.png`
   - QR code should scan to repo GitHub URL

**Console Check**:
- Should see: QR code generated from qrserver.com
- No CORS errors

#### Step 8: Test Canvas Drawer
1. **Click "View README & Code" button**
   - Drawer should slide in from right (desktop)
   - Or full screen modal (mobile)
   - Should show README content
   - Should have syntax highlighting
   - Should have close button (X)

2. **Click close button**
   - Drawer should slide out
   - Should return to repo details page

## Authentication Testing

### Test Without Login
1. **Sign out** if logged in
2. Navigate to repo details page
3. Try to vote → Should show "Please login to vote"
4. Try to save → Should show "Please login to save repositories"
5. Try to comment → Should show "Please login to comment"
6. Video tab → Should only show videos, no add button
7. Ratings tab → Should show average rating, no rate button

### Test With Login
1. **Sign in** with test account
2. All features should be enabled
3. User-specific data should load:
   - Your vote (upvote/downvote highlighted)
   - Your saved status (Saved vs Save button)
   - Your comments (with Edit/Delete buttons)
   - Your rating (stars should be filled)

## Error Testing

### Test Database Not Set Up
**Scenario**: Schema not run in Supabase
- Visit repo details page
- Console should show: 404 or table not found errors
- Features should gracefully fail with toast notifications

**Fix**: Run `supabase/repo-details-schema.sql` in Supabase

### Test Rate Limiting
**Scenario**: Too many votes/comments in short time
- Rapidly click vote button
- Should show: "Please wait before voting again" (if implemented)

### Test Malformed URLs
1. **Invalid YouTube URL**: `https://example.com/video`
   - Should show: "Invalid YouTube URL"
2. **Invalid repo path**: `/repo/invalid/path/extra`
   - Should show 404 page

### Test XSS Prevention
1. **Comment with HTML**: `<script>alert('xss')</script>`
   - Should display as plain text
   - Should NOT execute JavaScript
2. **Comment with markdown**: `**bold** text`
   - Should render formatted (bold)

## Performance Testing

### Test Large Comment Threads
1. Post 20+ comments
2. Reply to create 5-level deep nesting
3. Check:
   - Page should not lag
   - Scroll should be smooth
   - Comments should load quickly

### Test Multiple Videos
1. Add 5+ YouTube videos
2. Check:
   - All thumbnails load
   - No duplicate API calls
   - Videos play without buffering issues

## Mobile Testing

### Responsive Design
1. Open DevTools → Toggle device toolbar
2. Test at different widths:
   - 375px (mobile)
   - 768px (tablet)
   - 1024px (desktop)

**Check**:
- Canvas drawer becomes full screen on mobile
- Action buttons stack vertically if needed
- Vote section remains accessible
- Comments are readable without horizontal scroll

## Browser Testing

### Cross-Browser Compatibility
Test in:
- ✓ Chrome (primary)
- ✓ Firefox
- ✓ Safari (Mac)
- ✓ Edge

**Check**:
- YouTube embeds work
- QR code generates
- All buttons clickable
- Styles render correctly

## Console Monitoring

### What to Look For
**Good signs**:
```
✓ Vote registered successfully
✓ Comment posted
✓ Video added
✓ Collection updated
```

**Bad signs**:
```
✗ 404 Not Found (table doesn't exist)
✗ RLS policy violation
✗ CORS error
✗ Undefined reading 'property'
```

## Common Issues

### Votes Not Saving
**Symptoms**: Vote count updates but resets on refresh
**Cause**: Database table `repo_votes` not created
**Fix**: Run SQL schema in Supabase

### Comments Not Appearing
**Symptoms**: Comment posted but doesn't show
**Cause**: RLS policy blocking view
**Fix**: Check Supabase → Authentication → Policies

### Videos Not Embedding
**Symptoms**: Video URL accepted but no embed
**Cause**: Invalid YouTube URL format
**Fix**: Use format `https://youtube.com/watch?v=ID` or `https://youtu.be/ID`

### QR Code 404
**Symptoms**: QR code fails to generate
**Cause**: qrserver.com API down or rate limited
**Fix**: Wait and retry, or use alternative QR API

### Canvas Not Opening
**Symptoms**: Click button but drawer doesn't appear
**Cause**: RepoDrawer component not rendering
**Fix**: Check console for errors, verify props passed correctly

## Success Criteria

### All Tests Pass When:
- ✓ Vote count updates immediately and persists
- ✓ Save button toggles and count updates
- ✓ YouTube videos embed and play
- ✓ Comments post, edit, delete, and nest correctly
- ✓ Comment voting works independently from repo voting
- ✓ QR code generates and downloads
- ✓ Canvas drawer opens with README
- ✓ No console errors
- ✓ Works on mobile and desktop
- ✓ Authentication checks work (logged in vs logged out)

## Next Steps After Testing

1. **If all tests pass**:
   - Deploy to production
   - Monitor Supabase logs
   - Set up error tracking (Sentry)

2. **If tests fail**:
   - Check console errors
   - Review Supabase RLS policies
   - Verify API endpoints are accessible
   - Check authentication context

3. **Performance optimization**:
   - Add pagination to comments
   - Implement caching for vote counts
   - Lazy load videos
   - Add loading skeletons

## Support

**Stuck on a test?**
1. Check `HELLOGITHUB_IMPLEMENTATION.md` for detailed docs
2. Review API endpoint documentation in README
3. Check Supabase dashboard for RLS policy errors
4. Verify environment variables are set

**Still having issues?**
- Check if database schema was run completely
- Verify Supabase connection is active
- Test API endpoints directly in browser/Postman
- Check browser console for specific error messages
