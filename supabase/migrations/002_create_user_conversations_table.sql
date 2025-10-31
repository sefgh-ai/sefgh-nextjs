-- ============================================================================
-- USER CONVERSATIONS TABLE - AI Chat Storage
-- ============================================================================
-- This table stores chat conversations between users and AI
-- Optimized for Supabase with JSONB for messages and proper indexing
-- ============================================================================

-- Create user_conversations table
CREATE TABLE IF NOT EXISTS public.user_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  messages JSONB DEFAULT '[]'::jsonb NOT NULL,
  
  -- Metadata
  model TEXT DEFAULT 'gpt-4',
  total_tokens INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  is_pinned BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Primary indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.user_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.user_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.user_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.user_conversations(last_message_at DESC);

-- Status and pinned indexes
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.user_conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_user_pinned ON public.user_conversations(user_id, is_pinned) WHERE is_pinned = true;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_conversations_user_status_updated 
  ON public.user_conversations(user_id, status, updated_at DESC);

-- JSONB index for searching within messages
CREATE INDEX IF NOT EXISTS idx_conversations_messages_gin ON public.user_conversations USING GIN (messages);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.user_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON public.user_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own conversations
CREATE POLICY "Users can create own conversations"
  ON public.user_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON public.user_conversations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON public.user_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on any change
DROP TRIGGER IF EXISTS trigger_update_conversation_updated_at ON public.user_conversations;
CREATE TRIGGER trigger_update_conversation_updated_at
  BEFORE UPDATE ON public.user_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_updated_at();

-- Function: Update total_messages count
CREATE OR REPLACE FUNCTION public.update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_messages = jsonb_array_length(NEW.messages);
  NEW.last_message_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update message count when messages change
DROP TRIGGER IF EXISTS trigger_update_message_count ON public.user_conversations;
CREATE TRIGGER trigger_update_message_count
  BEFORE INSERT OR UPDATE OF messages ON public.user_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_message_count();

-- ============================================================================
-- HELPER FUNCTIONS for Application Use
-- ============================================================================

-- Function: Get recent conversations for a user
CREATE OR REPLACE FUNCTION public.get_recent_conversations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  total_messages INTEGER,
  last_message_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.total_messages,
    c.last_message_at,
    c.is_pinned,
    c.created_at
  FROM public.user_conversations c
  WHERE c.user_id = p_user_id AND c.status = 'active'
  ORDER BY c.is_pinned DESC, c.last_message_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Search conversations by title or content
CREATE OR REPLACE FUNCTION public.search_conversations(
  p_user_id UUID,
  p_search_term TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  total_messages INTEGER,
  last_message_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.total_messages,
    c.last_message_at
  FROM public.user_conversations c
  WHERE c.user_id = p_user_id 
    AND c.status = 'active'
    AND (
      c.title ILIKE '%' || p_search_term || '%'
      OR c.messages::text ILIKE '%' || p_search_term || '%'
    )
  ORDER BY c.last_message_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_conversations TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_conversations TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_conversations TO authenticated;

-- ============================================================================
-- MESSAGE FORMAT EXAMPLE
-- ============================================================================
/*
messages JSONB format (array of message objects):

[
  {
    "id": "msg_abc123",
    "role": "user",
    "content": "Hello, how are you?",
    "timestamp": "2025-10-31T10:30:00Z",
    "tokens": 5
  },
  {
    "id": "msg_def456",
    "role": "assistant",
    "content": "I'm doing well, thank you! How can I help you today?",
    "timestamp": "2025-10-31T10:30:02Z",
    "tokens": 12,
    "model": "gpt-4"
  },
  {
    "id": "msg_ghi789",
    "role": "user",
    "content": "Can you help me with coding?",
    "timestamp": "2025-10-31T10:30:15Z",
    "tokens": 7
  }
]

Each message object should contain:
- id: Unique message identifier
- role: "user" | "assistant" | "system"
- content: The message text
- timestamp: ISO 8601 timestamp
- tokens: Token count (optional)
- model: AI model used (optional, for assistant messages)
- metadata: Any additional data (optional)
*/

-- ============================================================================
-- EXAMPLE QUERIES
-- ============================================================================

/*
-- Create a new conversation
INSERT INTO public.user_conversations (user_id, title, messages)
VALUES (
  auth.uid(),
  'My First Chat',
  '[{"id": "msg_1", "role": "user", "content": "Hello!", "timestamp": "2025-10-31T10:00:00Z"}]'::jsonb
);

-- Add a message to existing conversation
UPDATE public.user_conversations
SET messages = messages || '[{"id": "msg_2", "role": "assistant", "content": "Hi there!", "timestamp": "2025-10-31T10:00:02Z"}]'::jsonb
WHERE id = 'conversation-id' AND user_id = auth.uid();

-- Get all conversations for user
SELECT id, title, total_messages, last_message_at
FROM public.user_conversations
WHERE user_id = auth.uid() AND status = 'active'
ORDER BY last_message_at DESC;

-- Get conversation with messages
SELECT *
FROM public.user_conversations
WHERE id = 'conversation-id' AND user_id = auth.uid();

-- Search within messages
SELECT id, title, messages
FROM public.user_conversations
WHERE user_id = auth.uid()
  AND messages::text ILIKE '%search term%';

-- Archive conversation
UPDATE public.user_conversations
SET status = 'archived'
WHERE id = 'conversation-id' AND user_id = auth.uid();

-- Pin conversation
UPDATE public.user_conversations
SET is_pinned = true
WHERE id = 'conversation-id' AND user_id = auth.uid();
*/

-- ✅ SETUP COMPLETE!
