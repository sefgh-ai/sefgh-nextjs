-- Onboarding Data Table
-- Stores user onboarding responses and progress

CREATE TABLE IF NOT EXISTS onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Step 1: Role & Experience
  role TEXT CHECK (role IN ('student', 'professional', 'researcher', 'hobbyist')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  
  -- Step 2: Tech Interests
  tech_stack TEXT[] DEFAULT '{}', -- Array of tech selections
  primary_language TEXT, -- Main programming language
  
  -- Step 3: Goals
  goals TEXT[] DEFAULT '{}', -- Array: ['learning', 'finding-tools', 'contributing', 'research']
  
  -- Step 4: GitHub Connection (Optional)
  github_connected BOOLEAN DEFAULT false,
  github_username TEXT,
  
  -- Step 5: Preferences
  notification_preference TEXT CHECK (notification_preference IN ('all', 'important', 'digest', 'none')) DEFAULT 'important',
  preferred_language TEXT DEFAULT 'en', -- i18n language code
  
  -- Progress Tracking
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  skipped BOOLEAN DEFAULT false,
  skipped_at TIMESTAMP WITH TIME ZONE,
  current_step INTEGER DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 5),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own onboarding data
CREATE POLICY "Users can read own onboarding data"
  ON onboarding_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data"
  ON onboarding_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data"
  ON onboarding_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own onboarding data"
  ON onboarding_data FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding_data(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_completed ON onboarding_data(completed);
CREATE INDEX IF NOT EXISTS idx_onboarding_skipped ON onboarding_data(skipped);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_onboarding_timestamp ON onboarding_data;
CREATE TRIGGER update_onboarding_timestamp
  BEFORE UPDATE ON onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

-- Comments for documentation
COMMENT ON TABLE onboarding_data IS 'Stores user onboarding responses and progress';
COMMENT ON COLUMN onboarding_data.role IS 'User role: student, professional, researcher, or hobbyist';
COMMENT ON COLUMN onboarding_data.experience_level IS 'Coding experience: beginner, intermediate, or expert';
COMMENT ON COLUMN onboarding_data.tech_stack IS 'Array of selected technologies/frameworks';
COMMENT ON COLUMN onboarding_data.goals IS 'Array of user goals for using SEFGH';
COMMENT ON COLUMN onboarding_data.current_step IS 'Current step in onboarding flow (1-5) for resuming';
COMMENT ON COLUMN onboarding_data.completed IS 'Whether user completed full onboarding';
COMMENT ON COLUMN onboarding_data.skipped IS 'Whether user skipped onboarding';
