-- Create repo_submissions table
CREATE TABLE IF NOT EXISTS repo_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[], -- Auto-detected from GitHub (languages, topics)
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE repo_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON repo_submissions FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies: Users can create their own submissions
CREATE POLICY "Users can create submissions"
ON repo_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_repo_submissions_user_id ON repo_submissions(user_id);
CREATE INDEX idx_repo_submissions_submitted_at ON repo_submissions(submitted_at DESC);
CREATE INDEX idx_repo_submissions_url ON repo_submissions(url); -- For fast duplicate checks
