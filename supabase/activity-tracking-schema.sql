-- Activity Tracking Schema
-- Tracks user activity (searches, views, interactions) for contribution graph

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'search', 'view', 'chat', 'bookmark', etc.
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_count INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}', -- Store additional context
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate entries for same day/type
  UNIQUE(user_id, activity_type, activity_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date 
  ON public.activity_logs(user_id, activity_date DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_type_date 
  ON public.activity_logs(user_id, activity_type, activity_date DESC);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own activity
CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own activity (for incrementing counts)
CREATE POLICY "Users can update own activity logs"
  ON public.activity_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to increment activity count
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, activity_type, activity_date, activity_count, metadata)
  VALUES (p_user_id, p_activity_type, CURRENT_DATE, 1, p_metadata)
  ON CONFLICT (user_id, activity_type, activity_date)
  DO UPDATE SET
    activity_count = activity_logs.activity_count + 1,
    metadata = p_metadata,
    updated_at = NOW();
END;
$$;

-- Function to get activity stats for a user
CREATE OR REPLACE FUNCTION public.get_user_activity_stats(
  p_user_id UUID,
  p_days INTEGER DEFAULT 365
)
RETURNS TABLE (
  total_activities BIGINT,
  avg_per_day NUMERIC,
  current_streak INTEGER,
  max_streak INTEGER,
  active_days BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_max_streak INTEGER := 0;
  v_temp_streak INTEGER := 0;
  v_date DATE;
  v_has_activity BOOLEAN;
BEGIN
  -- Get basic stats
  SELECT 
    COALESCE(SUM(activity_count), 0),
    COALESCE(ROUND(SUM(activity_count)::NUMERIC / NULLIF(p_days, 0), 1), 0),
    COUNT(DISTINCT activity_date)
  INTO 
    total_activities,
    avg_per_day,
    active_days
  FROM public.activity_logs
  WHERE user_id = p_user_id
    AND activity_date >= CURRENT_DATE - p_days;

  -- Calculate current streak (from today backwards)
  v_current_streak := 0;
  FOR i IN 0..p_days LOOP
    v_date := CURRENT_DATE - i;
    
    SELECT EXISTS(
      SELECT 1 
      FROM public.activity_logs 
      WHERE user_id = p_user_id 
        AND activity_date = v_date
    ) INTO v_has_activity;
    
    IF v_has_activity THEN
      v_current_streak := v_current_streak + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  -- Calculate max streak
  v_temp_streak := 0;
  v_max_streak := 0;
  FOR i IN 0..p_days LOOP
    v_date := CURRENT_DATE - i;
    
    SELECT EXISTS(
      SELECT 1 
      FROM public.activity_logs 
      WHERE user_id = p_user_id 
        AND activity_date = v_date
    ) INTO v_has_activity;
    
    IF v_has_activity THEN
      v_temp_streak := v_temp_streak + 1;
      IF v_temp_streak > v_max_streak THEN
        v_max_streak := v_temp_streak;
      END IF;
    ELSE
      v_temp_streak := 0;
    END IF;
  END LOOP;

  current_streak := v_current_streak;
  max_streak := v_max_streak;

  RETURN NEXT;
END;
$$;

-- Function to get activity heatmap data
CREATE OR REPLACE FUNCTION public.get_user_activity_heatmap(
  p_user_id UUID,
  p_days INTEGER DEFAULT 365
)
RETURNS TABLE (
  activity_date DATE,
  total_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    activity_date,
    SUM(activity_count)::INTEGER as total_count
  FROM public.activity_logs
  WHERE user_id = p_user_id
    AND activity_date >= CURRENT_DATE - p_days
  GROUP BY activity_date
  ORDER BY activity_date;
$$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.activity_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_activity_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_activity_heatmap TO authenticated;

-- Sample data insert (optional - for testing)
-- This shows how to log activity from your app
COMMENT ON FUNCTION public.log_user_activity IS 
'Call this function to log user activity. Example: SELECT log_user_activity(auth.uid(), ''search'', ''{"query": "react"}''::jsonb)';
