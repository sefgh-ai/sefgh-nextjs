-- Notifications Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Table: notifications
-- Stores user-specific notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    is_read BOOLEAN DEFAULT false,
    link TEXT, -- Optional link to navigate to
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically set read_at timestamp
CREATE OR REPLACE FUNCTION public.handle_notification_read()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_read = true AND OLD.is_read = false THEN
        NEW.read_at = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update read_at
CREATE TRIGGER set_read_at_notifications
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_notification_read();

-- Sample notifications (optional - for testing)
-- Replace 'YOUR_USER_ID' with an actual user ID from auth.users
/*
INSERT INTO public.notifications (user_id, title, message, type, link) VALUES
    ('YOUR_USER_ID', 'Welcome to API Playground!', 'Start by creating your first API key.', 'success', '/playground'),
    ('YOUR_USER_ID', 'Rate Limit Warning', 'You have used 80% of your daily API quota.', 'warning', '/playground?tab=limits'),
    ('YOUR_USER_ID', 'New Feature Available', 'Check out the new API testing interface!', 'info', '/playground?tab=testing');
*/
