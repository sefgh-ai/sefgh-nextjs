-- ============================================
-- QUICK SETUP: Copy and paste this entire file into Supabase SQL Editor
-- ============================================

-- Step 1: Create Tables
-- ============================================

CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time INTEGER,
    request_body TEXT,
    cost DECIMAL(10, 4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    max_request_size INTEGER DEFAULT 10,
    enable_rate_limiting BOOLEAN DEFAULT true,
    enable_ip_whitelist BOOLEAN DEFAULT false,
    enable_cors BOOLEAN DEFAULT true,
    ip_whitelist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON public.api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON public.api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON public.api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_limits_user_id ON public.api_limits(user_id);

-- Step 3: Enable Row Level Security
-- ============================================

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_limits ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies
-- ============================================

-- Policies for api_keys
CREATE POLICY "Users can view their own API keys"
    ON public.api_keys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys"
    ON public.api_keys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
    ON public.api_keys FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
    ON public.api_keys FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for api_logs
CREATE POLICY "Users can view their own API logs"
    ON public.api_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API logs"
    ON public.api_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies for api_limits
CREATE POLICY "Users can view their own API limits"
    ON public.api_limits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API limits"
    ON public.api_limits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API limits"
    ON public.api_limits FOR UPDATE
    USING (auth.uid() = user_id);

-- Step 5: Create Triggers
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_api_keys
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_api_limits
    BEFORE UPDATE ON public.api_limits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SETUP COMPLETE! 
-- Now navigate to /playground in your app
-- ============================================
