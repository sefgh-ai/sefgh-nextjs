-- QUICK SETUP: User Conversations Table
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- Create table
CREATE TABLE IF NOT EXISTS public.user_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  messages JSONB DEFAULT '[]'::jsonb NOT NULL,
  model TEXT DEFAULT 'gpt-4',
  total_tokens INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_conversations_user_id ON public.user_conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON public.user_conversations(updated_at DESC);
CREATE INDEX idx_conversations_last_message_at ON public.user_conversations(last_message_at DESC);
CREATE INDEX idx_conversations_user_pinned ON public.user_conversations(user_id, is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_conversations_messages_gin ON public.user_conversations USING GIN (messages);

-- Enable RLS
ALTER TABLE public.user_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own conversations" ON public.user_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own conversations" ON public.user_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.user_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.user_conversations FOR DELETE USING (auth.uid() = user_id);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_conversation_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_updated_at BEFORE UPDATE ON public.user_conversations 
FOR EACH ROW EXECUTE FUNCTION public.update_conversation_updated_at();

-- Auto-update message count
CREATE OR REPLACE FUNCTION public.update_conversation_message_count() RETURNS TRIGGER AS $$
BEGIN NEW.total_messages = jsonb_array_length(NEW.messages); NEW.last_message_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_count BEFORE INSERT OR UPDATE OF messages ON public.user_conversations 
FOR EACH ROW EXECUTE FUNCTION public.update_conversation_message_count();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_conversations TO authenticated;

-- ✅ DONE! Test with: SELECT * FROM user_conversations LIMIT 5;
