-- Categories table for dynamic category/tag management
-- Categories can be added by users and used for filtering projects

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT '🏷️',
  type text NOT NULL DEFAULT 'custom',
  -- Types: 'programming', 'technology', 'application', 'other', 'custom'
  description text,
  usage_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_usage_count ON public.categories(usage_count DESC);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Everyone can read active categories
CREATE POLICY "Active categories are viewable by everyone"
  ON public.categories
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can insert new categories
CREATE POLICY "Authenticated users can create categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update categories they created
CREATE POLICY "Users can update their own categories"
  ON public.categories
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can deactivate (soft delete) their own categories
CREATE POLICY "Users can deactivate their own categories"
  ON public.categories
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage count when category is used
CREATE OR REPLACE FUNCTION increment_category_usage(category_name text)
RETURNS void AS $$
BEGIN
  UPDATE public.categories
  SET usage_count = usage_count + 1
  WHERE name = category_name AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE ON public.categories TO authenticated;
GRANT EXECUTE ON FUNCTION increment_category_usage TO authenticated;
