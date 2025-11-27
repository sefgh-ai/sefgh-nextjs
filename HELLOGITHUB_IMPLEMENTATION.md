# HelloGitHub-Style Repository Details Implementation

## Overview
Complete implementation of a HelloGitHub-style repository details page with voting, ratings, comments, collections, video embedding, and QR code generation.

## Features Implemented

### 1. Repository Details Page
- **Route**: `/repo/[owner]/[repo-name]`
- **Layout**: Full-page view with drawer-style canvas for README/code
- **Components**:
  - Main header with repo stats (stars, forks, issues, watchers)
  - Action buttons (Visit GitHub, View Canvas, Save, Discuss, QR Code)
  - Reddit-style voting system
  - Tabbed interface (Description, Ratings, Video)
  - Comment system with nested replies

### 2. Vote System (Reddit-style)
- **Features**:
  - Upvote/Downvote functionality
  - Vote count with K/M formatting
  - Visual feedback for user votes
  - Optimistic UI updates
- **Components**: `RepoVoteSection.jsx`
- **API**: `/api/repo/vote`
- **Database**: `repo_votes` table with RLS

### 3. Rating System (5-star)
- **Features**:
  - 5-star rating with half-star support
  - Written reviews
  - Average rating calculation
  - Rating distribution display
- **Components**: `RepoRatingSection.jsx`
- **API**: `/api/repo/rating`
- **Database**: `repo_ratings` table

### 4. Collection/Save Feature
- **Features**:
  - Save repositories to collections
  - Total save count display
  - Toggle save/unsave
  - Authentication required
- **Components**: `RepoCollectButton.jsx`
- **API**: `/api/repo/collect`
- **Database**: `repo_collections` table

### 5. Video Tab
- **Features**:
  - YouTube video embedding
  - GitHub video support
  - Add/delete videos
  - Multiple video support
  - Thumbnail display
- **Components**: `RepoVideoTab.jsx`
- **API**: `/api/repo/videos`
- **Database**: `repo_videos` table

### 6. Comment System
- **Features**:
  - Post top-level comments
  - Nested replies (up to 5 levels)
  - Comment voting (upvote/downvote)
  - Edit/delete own comments
  - Sort options (newest/oldest/most voted)
  - Authentication required
- **Components**: `RepoCommentsSection.jsx`
- **API**: 
  - `/api/repo/comments` (CRUD)
  - `/api/repo/comments/vote` (voting)
- **Database**: 
  - `repo_comments` table
  - `comment_votes` table

### 7. QR Code Generator
- **Features**:
  - Generate QR code for repo URL
  - Download QR code as PNG
  - Modal dialog display
- **Components**: `RepoQRCode.jsx`
- **Service**: qrserver.com API

### 8. Canvas Integration
- **Features**:
  - Side drawer on desktop (40% width)
  - Full screen on mobile
  - README and code display
  - Syntax highlighting
- **Components**: `RepoDrawer.jsx`

## Database Schema

### Tables Created
All tables are in `supabase/repo-details-schema.sql`:

1. **repo_votes** - Repository voting
   - Columns: id, user_id, repo_full_name, vote_type, created_at
   - RLS: Users can vote, view all votes
   - Unique constraint: One vote per user per repo

2. **repo_ratings** - 5-star ratings with reviews
   - Columns: id, user_id, repo_full_name, rating, review_text, created_at, updated_at
   - RLS: Users can rate, view all ratings
   - Unique constraint: One rating per user per repo

3. **repo_comments** - Comment system
   - Columns: id, user_id, repo_full_name, parent_id, comment_text, is_edited, is_deleted, created_at, updated_at
   - RLS: Users can CRUD own comments, view non-deleted
   - Max nesting: 5 levels

4. **comment_votes** - Comment voting
   - Columns: id, user_id, comment_id, vote_type, created_at
   - RLS: Users can vote, view all votes
   - Unique constraint: One vote per user per comment

5. **repo_claims** - Repository ownership claims
   - Columns: id, user_id, repo_full_name, claim_status, github_username, verification_token, created_at, updated_at
   - RLS: Users can create claims, view own claims

6. **repo_collections** - Saved/bookmarked repos
   - Columns: id, user_id, repo_full_name, collection_name, notes, created_at
   - RLS: Users can CRUD own collections
   - Unique constraint: One repo per collection per user

7. **repo_videos** - Video content for repos
   - Columns: id, repo_full_name, user_id, video_url, video_type, title, description, thumbnail_url, created_at
   - RLS: Users can add/delete videos, view all
   - Types: youtube, github, direct

### Views
- **repo_vote_stats** - Aggregate vote counts per repo
- **repo_rating_stats** - Average ratings per repo
- **comment_vote_stats** - Vote counts per comment

### Triggers
- **update_comment_vote_count** - Auto-update vote counts on vote insert/delete

## Setup Instructions

### 1. Database Setup
```bash
# Run the SQL schema in Supabase SQL Editor
# File: supabase/repo-details-schema.sql
# This creates all tables, views, triggers, and RLS policies
```

### 2. Environment Variables
No additional environment variables needed beyond existing Supabase config.

### 3. Test the Implementation

#### Navigate to Repo Details
1. Go to `/search`
2. Search for a repository
3. Click on any repository card
4. Should navigate to `/repo/[owner]/[repo-name]`

#### Test Voting
1. Click upvote/downvote arrows
2. Vote count should update immediately
3. Arrow should highlight when voted
4. Click again to remove vote

#### Test Collection/Save
1. Click "Save" button
2. Should show "Saved" with count
3. Click again to unsave

#### Test Video Tab
1. Click "Video" tab
2. Click "Add Video"
3. Paste YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
4. Video should embed with thumbnail
5. Click delete to remove

#### Test Comments
1. Type comment in textarea
2. Click "Post Comment"
3. Should appear at top of list
4. Click "Reply" to test nested comments
5. Click upvote/downvote on comments
6. Try editing/deleting own comments

#### Test QR Code
1. Click QR code icon button (top right)
2. QR code should generate
3. Click "Download QR Code" to save

## API Endpoints

### Vote API (`/api/repo/vote`)
```javascript
// POST - Vote on repo
await fetch('/api/repo/vote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoFullName: 'owner/repo',
    voteType: 'upvote' // or 'downvote', null to remove
  })
})

// GET - Get vote stats
const response = await fetch('/api/repo/vote?repo=owner/repo')
```

### Collect API (`/api/repo/collect`)
```javascript
// POST - Add to collection
await fetch('/api/repo/collect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoFullName: 'owner/repo',
    collectionName: 'default',
    notes: 'Optional notes'
  })
})

// DELETE - Remove from collection
await fetch('/api/repo/collect?repo=owner/repo', {
  method: 'DELETE'
})

// GET - Check if saved
const response = await fetch('/api/repo/collect?repo=owner/repo')
```

### Video API (`/api/repo/videos`)
```javascript
// POST - Add video
await fetch('/api/repo/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoFullName: 'owner/repo',
    videoUrl: 'https://youtube.com/watch?v=...',
    title: 'Optional title',
    description: 'Optional description'
  })
})

// DELETE - Remove video
await fetch('/api/repo/videos?id=123', {
  method: 'DELETE'
})

// GET - Get videos
const response = await fetch('/api/repo/videos?repo=owner/repo')
```

### Comments API (`/api/repo/comments`)
```javascript
// POST - Post comment
await fetch('/api/repo/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoFullName: 'owner/repo',
    commentText: 'My comment',
    parentId: null // or parent comment ID for nested replies
  })
})

// PATCH - Edit comment
await fetch('/api/repo/comments?id=123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commentText: 'Updated comment'
  })
})

// DELETE - Delete comment (soft delete)
await fetch('/api/repo/comments?id=123', {
  method: 'DELETE'
})

// GET - Get comments
const response = await fetch('/api/repo/comments?repo=owner/repo&sort=newest')
```

### Comment Vote API (`/api/repo/comments/vote`)
```javascript
// POST - Vote on comment
await fetch('/api/repo/comments/vote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commentId: 123,
    voteType: 'upvote' // or 'downvote', null to remove
  })
})

// GET - Get user's vote
const response = await fetch('/api/repo/comments/vote?commentId=123')
```

## Component Props

### RepoDetailsLayout
```javascript
<RepoDetailsLayout
  repoData={{
    name: 'repo-name',
    full_name: 'owner/repo-name',
    description: '...',
    // ... other GitHub API data
  }}
  sefghData={{
    votes: { upvotes, downvotes, net_votes },
    userVote: 'upvote' | 'downvote' | null,
    ratings: { total, average },
    userRating: { rating, review_text },
    comments: [...],
    saveCount: 42,
    userSaved: false
  }}
  owner="owner"
  repoName="repo-name"
/>
```

### RepoVoteSection
```javascript
<RepoVoteSection
  repoFullName="owner/repo"
  initialVotes={{ upvotes: 100, downvotes: 5 }}
  initialUserVote="upvote" | null
/>
```

### RepoCollectButton
```javascript
<RepoCollectButton
  repoFullName="owner/repo"
  initialSaved={false}
  initialCount={42}
/>
```

### RepoVideoTab
```javascript
<RepoVideoTab
  repoFullName="owner/repo"
/>
```

### RepoQRCode
```javascript
<RepoQRCode
  repoUrl="https://github.com/owner/repo"
/>
```

### RepoCommentsSection
```javascript
<RepoCommentsSection
  repoFullName="owner/repo"
  initialComments={[...]}
/>
```

## File Structure
```
src/
├── app/
│   ├── repo/
│   │   └── [owner]/
│   │       └── [repo-name]/
│   │           └── page.js          # Dynamic route
│   └── api/
│       └── repo/
│           ├── vote/
│           │   └── route.js         # Vote API
│           ├── rating/
│           │   └── route.js         # Rating API
│           ├── collect/
│           │   └── route.js         # Collection API
│           ├── videos/
│           │   └── route.js         # Video API
│           └── comments/
│               ├── route.js         # Comments CRUD
│               └── vote/
│                   └── route.js     # Comment voting
└── components/
    └── repo-details/
        ├── RepoDetailsLayout.jsx    # Main layout
        ├── RepoVoteSection.jsx      # Voting UI
        ├── RepoDrawer.jsx           # Canvas drawer
        ├── RepoRatingSection.jsx    # Ratings UI
        ├── RepoCommentsSection.jsx  # Comments UI
        ├── RepoCollectButton.jsx    # Save button
        ├── RepoVideoTab.jsx         # Video tab
        └── RepoQRCode.jsx           # QR generator

supabase/
└── repo-details-schema.sql          # Database schema
```

## Known Limitations

1. **Comment Nesting**: Limited to 5 levels to prevent infinite recursion
2. **Video Support**: YouTube and GitHub videos only (no Vimeo yet)
3. **Collections**: Single collection per user (no multiple collections yet)
4. **QR Code**: Uses external API (qrserver.com) - may have rate limits
5. **Star Growth**: Chart not implemented yet (needs historical data)

## Future Enhancements

1. **Multiple Collections**: Allow users to organize repos into custom collections
2. **Video Timestamps**: Add timestamp comments on videos
3. **Comment Reactions**: Add emoji reactions to comments
4. **Notification System**: Notify repo owners of comments/ratings
5. **Repository Claiming**: Allow maintainers to claim ownership
6. **Star Growth Chart**: Display historical star data
7. **Export Collections**: Export saved repos as JSON/CSV
8. **Advanced Search**: Filter by rating, votes, video availability

## Troubleshooting

### Vote not updating
- Check browser console for API errors
- Verify user is logged in
- Check Supabase RLS policies in SQL Editor

### Videos not embedding
- Verify YouTube URL format
- Check CORS settings
- Try different video URL

### Comments not appearing
- Check `is_deleted` flag in database
- Verify RLS policies allow viewing
- Check sort order (newest/oldest)

### QR Code not generating
- Check internet connection
- qrserver.com API may be rate-limited
- Try again in a few minutes

## Performance Considerations

1. **Pagination**: Comments load 10 at a time (can be increased)
2. **Optimistic Updates**: Votes update immediately before server response
3. **Caching**: Consider implementing Redis for vote/rating counts
4. **Indexing**: Database has indexes on frequently queried columns
5. **Real-time**: Not using Supabase real-time subscriptions (optional enhancement)

## Security

- All database operations protected by Row Level Security (RLS)
- Users can only modify their own content (votes, ratings, comments, collections)
- Soft delete for comments (preserves comment tree structure)
- SQL injection prevention via parameterized queries
- XSS prevention via React's built-in escaping

## Testing Checklist

- [ ] Database schema runs without errors
- [ ] Navigate to repo details page
- [ ] Upvote/downvote works
- [ ] Save/unsave repository
- [ ] Post top-level comment
- [ ] Reply to comment (nested)
- [ ] Vote on comments
- [ ] Edit/delete own comment
- [ ] Add YouTube video
- [ ] Delete video
- [ ] Generate QR code
- [ ] Download QR code
- [ ] Open canvas drawer
- [ ] Test on mobile (responsive)
- [ ] Test without login (auth checks)

## Deployment Notes

1. Run SQL schema in Supabase production environment
2. Verify all RLS policies are active
3. Test API endpoints in production
4. Monitor for any CORS issues
5. Set up error tracking (Sentry recommended)

## Support

For issues or questions:
1. Check this README first
2. Review Supabase logs in dashboard
3. Check browser console for client-side errors
4. Review API route logs in Vercel/production
