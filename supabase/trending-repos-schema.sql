-- Trending Repositories Table
-- Stores curated trending repos by topic with auto-refresh every 3 days

CREATE TABLE IF NOT EXISTS trending_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL, -- e.g., 'ai-ml', 'web-dev', 'mobile', etc.
  repo_full_name TEXT NOT NULL, -- e.g., 'facebook/react'
  repo_data JSONB NOT NULL, -- Full GitHub repo object
  rank INTEGER NOT NULL, -- Position in topic (1-5)
  stars_count INTEGER DEFAULT 0,
  created_at_github TIMESTAMP WITH TIME ZONE, -- When repo was created on GitHub
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate repos in same topic
  UNIQUE(topic, repo_full_name)
);

-- Enable Row Level Security
ALTER TABLE trending_repos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access (unrestricted)
CREATE POLICY "Public read access for trending repos"
  ON trending_repos FOR SELECT
  TO public
  USING (true);

-- Allow service role to manage data (for API endpoints)
CREATE POLICY "Service role can insert trending repos"
  ON trending_repos FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update trending repos"
  ON trending_repos FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete trending repos"
  ON trending_repos FOR DELETE
  TO service_role
  USING (true);

-- Allow authenticated users to manage (optional, for admin dashboard)
CREATE POLICY "Authenticated users can insert trending repos"
  ON trending_repos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update trending repos"
  ON trending_repos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete trending repos"
  ON trending_repos FOR DELETE
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trending_topic ON trending_repos(topic);
CREATE INDEX IF NOT EXISTS idx_trending_fetched ON trending_repos(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_rank ON trending_repos(topic, rank);

-- Function to check if data is stale (older than 3 days)
CREATE OR REPLACE FUNCTION is_trending_data_stale()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM trending_repos
    WHERE fetched_at > NOW() - INTERVAL '3 days'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trending_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_trending_timestamp ON trending_repos;
CREATE TRIGGER update_trending_timestamp
  BEFORE UPDATE ON trending_repos
  FOR EACH ROW
  EXECUTE FUNCTION update_trending_updated_at();

-- Comments for documentation
COMMENT ON TABLE trending_repos IS 'Stores curated trending repositories by topic, refreshed every 3 days';
COMMENT ON COLUMN trending_repos.topic IS 'Topic category: ai-ml, web-dev, mobile, devops, data-science, security';
COMMENT ON COLUMN trending_repos.repo_data IS 'Full GitHub repository object (JSON)';
COMMENT ON COLUMN trending_repos.rank IS 'Position in topic trending list (1-5)';
COMMENT ON COLUMN trending_repos.fetched_at IS 'When this data was last fetched from GitHub';
