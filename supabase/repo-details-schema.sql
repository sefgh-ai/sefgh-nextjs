-- Repository Details Feature Schema
-- This schema supports SEFGH-specific features for repository pages:
-- - Reddit-style voting (upvote/downvote)
-- - 5-star ratings
-- - Nested comments (Reddit-style)
-- - Project ownership claiming

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- REPO VOTES TABLE (Reddit-style upvote/downvote)
-- ============================================
CREATE TABLE IF NOT EXISTS repo_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL, -- Format: "owner/repo-name"
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one vote per user per repo
  UNIQUE(user_id, repo_full_name)
);

CREATE INDEX IF NOT EXISTS idx_repo_votes_repo ON repo_votes(repo_full_name);
CREATE INDEX IF NOT EXISTS idx_repo_votes_user ON repo_votes(user_id);

-- RLS Policies for repo_votes
ALTER TABLE repo_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all votes" ON repo_votes;
CREATE POLICY "Users can view all votes"
  ON repo_votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own votes" ON repo_votes;
CREATE POLICY "Users can insert their own votes"
  ON repo_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON repo_votes;
CREATE POLICY "Users can update their own votes"
  ON repo_votes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON repo_votes;
CREATE POLICY "Users can delete their own votes"
  ON repo_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPO RATINGS TABLE (5-star ratings)
-- ============================================
CREATE TABLE IF NOT EXISTS repo_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One rating per user per repo
  UNIQUE(user_id, repo_full_name)
);

CREATE INDEX IF NOT EXISTS idx_repo_ratings_repo ON repo_ratings(repo_full_name);
CREATE INDEX IF NOT EXISTS idx_repo_ratings_user ON repo_ratings(user_id);

-- RLS Policies for repo_ratings
ALTER TABLE repo_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all ratings" ON repo_ratings;
CREATE POLICY "Users can view all ratings"
  ON repo_ratings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own ratings" ON repo_ratings;
CREATE POLICY "Users can insert their own ratings"
  ON repo_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ratings" ON repo_ratings;
CREATE POLICY "Users can update their own ratings"
  ON repo_ratings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own ratings" ON repo_ratings;
CREATE POLICY "Users can delete their own ratings"
  ON repo_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPO COMMENTS TABLE (Reddit-style nested comments)
-- ============================================
CREATE TABLE IF NOT EXISTS repo_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  parent_id UUID REFERENCES repo_comments(id) ON DELETE CASCADE, -- NULL for top-level comments
  comment_text TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_repo_comments_repo ON repo_comments(repo_full_name);
-- RLS Policies for repo_comments
ALTER TABLE repo_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all non-deleted comments" ON repo_comments;
CREATE POLICY "Users can view all non-deleted comments"
  ON repo_comments FOR SELECT
  USING (is_deleted = false OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own comments" ON repo_comments;
CREATE POLICY "Users can insert their own comments"
  ON repo_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON repo_comments;
CREATE POLICY "Users can update their own comments"
  ON repo_comments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON repo_comments;
CREATE POLICY "Users can delete their own comments"
  ON repo_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENT VOTES TABLE (Vote on individual comments)
-- ============================================
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES repo_comments(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, comment_id)
);
-- RLS Policies for comment_votes
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all comment votes" ON comment_votes;
CREATE POLICY "Users can view all comment votes"
  ON comment_votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own comment votes" ON comment_votes;
CREATE POLICY "Users can insert their own comment votes"
  ON comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comment votes" ON comment_votes;
CREATE POLICY "Users can update their own comment votes"
  ON comment_votes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comment votes" ON comment_votes;
CREATE POLICY "Users can delete their own comment votes"
  ON comment_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPO CLAIMS TABLE (Project ownership verification)
-- ============================================
CREATE TABLE IF NOT EXISTS repo_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  github_username TEXT NOT NULL,
  claim_status TEXT NOT NULL DEFAULT 'pending' CHECK (claim_status IN ('pending', 'verified', 'rejected')),
  verification_method TEXT, -- 'commit', 'file', 'github-app'
  verification_data JSONB, -- Store verification proof
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  UNIQUE(repo_full_name)
);

-- RLS Policies for repo_claims
ALTER TABLE repo_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view verified claims" ON repo_claims;
CREATE POLICY "Users can view verified claims"
  ON repo_claims FOR SELECT
  USING (claim_status = 'verified' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own claims" ON repo_claims;
CREATE POLICY "Users can insert their own claims"
  ON repo_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own claims" ON repo_claims;
CREATE POLICY "Users can view their own claims"
  ON repo_claims FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View for repository vote statistics
CREATE OR REPLACE VIEW repo_vote_stats AS
SELECT 
  repo_full_name,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvotes,
  COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvotes,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') - COUNT(*) FILTER (WHERE vote_type = 'downvote') as net_votes
FROM repo_votes
GROUP BY repo_full_name;

-- View for repository rating statistics
CREATE OR REPLACE VIEW repo_rating_stats AS
SELECT 
  repo_full_name,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating)::numeric, 1) as average_rating
FROM repo_ratings
GROUP BY repo_full_name;

-- View for repository comment counts
CREATE OR REPLACE VIEW repo_comment_stats AS
SELECT 
  repo_full_name,
  COUNT(*) as total_comments
FROM repo_comments
WHERE is_deleted = false
GROUP BY repo_full_name;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE repo_comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE repo_comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE repo_comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE repo_comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
    END IF;
    IF NEW.vote_type = 'upvote' THEN
      UPDATE repo_comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE repo_comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE repo_comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE repo_comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment vote count updates
DROP TRIGGER IF EXISTS trigger_update_comment_vote_count ON comment_votes;
CREATE TRIGGER trigger_update_comment_vote_count
AFTER INSERT OR UPDATE OR DELETE ON comment_votes
FOR EACH ROW EXECUTE FUNCTION update_comment_vote_count();

-- ============================================
-- REPO COLLECTIONS TABLE (Save/Bookmark repos)
-- ============================================
CREATE TABLE IF NOT EXISTS repo_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  collection_name TEXT DEFAULT 'default', -- Allow users to organize into collections
  notes TEXT, -- Optional notes about why they saved it
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One repo can be in multiple collections per user
  UNIQUE(user_id, repo_full_name, collection_name)
);

CREATE INDEX IF NOT EXISTS idx_repo_collections_user ON repo_collections(user_id);
-- RLS Policies for repo_collections
ALTER TABLE repo_collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own collections" ON repo_collections;
CREATE POLICY "Users can view their own collections"
  ON repo_collections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own collections" ON repo_collections;
CREATE POLICY "Users can insert their own collections"
  ON repo_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own collections" ON repo_collections;
CREATE POLICY "Users can update their own collections"
  ON repo_collections FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own collections" ON repo_collections;
CREATE POLICY "Users can delete their own collections"
  ON repo_collections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPO VIDEOS TABLE (Store video links)
-- ============================================
CREATE TABLE IF NOT EXISTS repo_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_full_name TEXT NOT NULL,
  video_url TEXT NOT NULL, -- YouTube, GitHub video, or direct link
  video_type TEXT NOT NULL CHECK (video_type IN ('youtube', 'github', 'direct')), 
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- Duration in seconds
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false
);
-- RLS Policies for repo_videos
ALTER TABLE repo_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view videos" ON repo_videos;
CREATE POLICY "Anyone can view videos"
  ON repo_videos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert videos" ON repo_videos;
CREATE POLICY "Authenticated users can insert videos"
  ON repo_videos FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can update their own videos" ON repo_videos;
CREATE POLICY "Users can update their own videos"
  ON repo_videos FOR UPDATE
  USING (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can delete their own videos" ON repo_videos;
CREATE POLICY "Users can delete their own videos"
  ON repo_videos FOR DELETE
  USING (auth.uid() = uploaded_by);

-- ============================================
-- HELPER VIEWS (Additional)
-- ============================================

-- View for repository collection counts
CREATE OR REPLACE VIEW repo_collection_stats AS
SELECT 
  repo_full_name,
  COUNT(DISTINCT user_id) as total_saves
FROM repo_collections
GROUP BY repo_full_name;

-- ============================================
-- SETUP COMPLETE MESSAGE
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- Then verify tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'repo_%';
