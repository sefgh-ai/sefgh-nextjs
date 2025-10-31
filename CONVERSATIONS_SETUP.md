# 🗨️ User Conversations Table - Setup Guide

## 📋 Overview
This guide explains how to set up the `user_conversations` table in Supabase for storing AI chat conversations efficiently using JSONB format.

## 🎯 Why This Design?

### JSONB Format Benefits
- ✅ **Fast queries** - Native JSON operations in PostgreSQL
- ✅ **Flexible schema** - Easy to add new message fields
- ✅ **Atomic updates** - Single row per conversation
- ✅ **Efficient storage** - Messages stored as array in one column
- ✅ **GIN indexing** - Fast full-text search within messages

### Alternative Approaches (NOT Recommended)
- ❌ Separate `messages` table - Slower queries, more complex joins
- ❌ Plain TEXT - No structure, hard to query
- ❌ Multiple columns - Limited flexibility

## 🗄️ Table Structure

```sql
user_conversations
├── id                  UUID        Primary key
├── user_id            UUID        Foreign key to auth.users
├── title              TEXT        Conversation title
├── messages           JSONB       Array of message objects
├── model              TEXT        AI model used
├── total_tokens       INTEGER     Total tokens used
├── total_messages     INTEGER     Auto-calculated count
├── status             TEXT        active | archived | deleted
├── is_pinned          BOOLEAN     Pin important conversations
├── created_at         TIMESTAMP   Creation time
├── updated_at         TIMESTAMP   Auto-updated
└── last_message_at    TIMESTAMP   Last message time
```

## 📝 Message Format (JSONB)

Each conversation's `messages` column stores an array of message objects:

```json
[
  {
    "id": "msg_1730123456789_abc123",
    "role": "user",
    "content": "Hello! Can you help me with coding?",
    "timestamp": "2025-10-31T10:30:00Z",
    "tokens": 8
  },
  {
    "id": "msg_1730123458901_def456",
    "role": "assistant",
    "content": "Of course! I'd be happy to help with your coding questions.",
    "timestamp": "2025-10-31T10:30:02Z",
    "tokens": 15,
    "model": "gpt-4"
  },
  {
    "id": "msg_1730123465432_ghi789",
    "role": "user",
    "content": "How do I create a React component?",
    "timestamp": "2025-10-31T10:30:15Z",
    "tokens": 9
  }
]
```

### Message Object Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique message identifier |
| `role` | string | ✅ | "user" \| "assistant" \| "system" |
| `content` | string | ✅ | Message text |
| `timestamp` | string | ✅ | ISO 8601 timestamp |
| `tokens` | number | ❌ | Token count (optional) |
| `model` | string | ❌ | AI model (optional) |
| `metadata` | object | ❌ | Any additional data |

## 🚀 Setup Instructions

### Step 1: Run SQL Setup

1. Open **Supabase Dashboard** → https://supabase.com/dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy content from: `supabase/CONVERSATIONS_QUICK_SETUP.sql`
5. Paste and click **"Run"**

### Step 2: Verify Setup

```sql
-- Check table exists
SELECT * FROM user_conversations LIMIT 5;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'user_conversations';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'user_conversations';
```

## ✅ Features

### 1. Row Level Security (RLS)
- ✅ Users can only access their own conversations
- ✅ Complete isolation between users
- ✅ Safe to use with anon key

### 2. Auto-Updating Fields
- ✅ `updated_at` - Auto-updates on any change
- ✅ `total_messages` - Auto-counts messages in array
- ✅ `last_message_at` - Updates when messages added

### 3. Performance Optimization
- ✅ GIN index on messages (full-text search)
- ✅ Index on user_id (fast user queries)
- ✅ Index on timestamps (sorting)
- ✅ Composite indexes (common queries)

### 4. Search Capabilities
- ✅ Search by conversation title
- ✅ Search within message content
- ✅ Full-text search with GIN index

## 🎨 Usage Examples

### Create a New Conversation

```javascript
import { createConversation, createMessage } from '@/lib/supabase/conversations'

// Create with initial message
const initialMessage = createMessage('user', 'Hello AI!', {
  tokens: 3
})

const conversation = await createConversation(
  user.id,
  'My First Chat',
  initialMessage
)
```

### Add Messages to Conversation

```javascript
import { addMessage, createMessage } from '@/lib/supabase/conversations'

// Create user message
const userMessage = createMessage('user', 'What is React?')

// Add to conversation
await addMessage(conversation.id, user.id, userMessage)

// Create AI response
const aiMessage = createMessage('assistant', 'React is a JavaScript library...', {
  model: 'gpt-4',
  tokens: 25
})

// Add AI response
await addMessage(conversation.id, user.id, aiMessage)
```

### Get All Conversations

```javascript
import { getUserConversations } from '@/lib/supabase/conversations'

const conversations = await getUserConversations(user.id, {
  limit: 20,
  status: 'active',
  orderBy: 'last_message_at',
  ascending: false
})

console.log(conversations)
// Returns: [{ id, title, total_messages, last_message_at, ... }]
```

### Get Single Conversation with Messages

```javascript
import { getConversation } from '@/lib/supabase/conversations'

const conversation = await getConversation(conversationId, user.id)

console.log(conversation.messages)
// Returns: Full array of messages
```

### Update Conversation Title

```javascript
import { updateConversationTitle } from '@/lib/supabase/conversations'

await updateConversationTitle(
  conversationId,
  user.id,
  'React Tutorial Chat'
)
```

### Pin a Conversation

```javascript
import { toggleConversationPin } from '@/lib/supabase/conversations'

await toggleConversationPin(conversationId, user.id, true)  // Pin
await toggleConversationPin(conversationId, user.id, false) // Unpin
```

### Archive Conversation

```javascript
import { archiveConversation } from '@/lib/supabase/conversations'

await archiveConversation(conversationId, user.id)
```

### Search Conversations

```javascript
import { searchConversations } from '@/lib/supabase/conversations'

const results = await searchConversations(user.id, 'React', 10)
// Searches in both title and message content
```

### Real-time Updates

```javascript
import { subscribeToConversation } from '@/lib/supabase/conversations'

const channel = subscribeToConversation(conversationId, (payload) => {
  console.log('Conversation updated:', payload.new)
  // Update UI with new data
})

// Cleanup
return () => unsubscribeFromConversation(channel)
```

### Get Statistics

```javascript
import { getConversationStats } from '@/lib/supabase/conversations'

const stats = await getConversationStats(user.id)
console.log(stats)
// {
//   total: 15,
//   active: 12,
//   archived: 3,
//   totalMessages: 450,
//   totalTokens: 12500
// }
```

## 🔍 Advanced Queries

### Direct SQL Queries

```javascript
const supabase = createClient()

// Get recent conversations
const { data } = await supabase
  .from('user_conversations')
  .select('*')
  .eq('user_id', user.id)
  .eq('status', 'active')
  .order('last_message_at', { ascending: false })
  .limit(10)

// Search in messages
const { data } = await supabase
  .from('user_conversations')
  .select('id, title, messages')
  .eq('user_id', user.id)
  .textSearch('messages', 'React', { config: 'english' })

// Get pinned conversations
const { data } = await supabase
  .from('user_conversations')
  .select('*')
  .eq('user_id', user.id)
  .eq('is_pinned', true)
  .order('last_message_at', { ascending: false })
```

## 🎯 Best Practices

### 1. Message Management
```javascript
// ✅ Good: Create properly formatted messages
const message = createMessage('user', content, {
  tokens: calculateTokens(content),
  metadata: { source: 'web' }
})

// ❌ Bad: Manual object creation (error-prone)
const message = {
  id: 'abc',  // Not unique!
  content: content,
  // Missing required fields
}
```

### 2. Error Handling
```javascript
try {
  const conversation = await getConversation(id, user.id)
} catch (error) {
  if (error.code === 'PGRST116') {
    // Conversation not found
    toast.error('Conversation not found')
  } else {
    // Other error
    toast.error('Failed to load conversation')
  }
}
```

### 3. Pagination
```javascript
// Load conversations in batches
const loadMoreConversations = async (offset) => {
  const conversations = await getUserConversations(user.id, {
    limit: 20,
    offset: offset
  })
  return conversations
}
```

### 4. Token Tracking
```javascript
// Update total tokens when adding messages
const updateTotalTokens = async (conversationId, userId, newTokens) => {
  const conversation = await getConversation(conversationId, userId)
  const totalTokens = conversation.total_tokens + newTokens
  
  await supabase
    .from('user_conversations')
    .update({ total_tokens: totalTokens })
    .eq('id', conversationId)
}
```

## 🔒 Security

### RLS Policies
All queries are automatically filtered by `user_id`:

```sql
-- Users can only see their own conversations
WHERE user_id = auth.uid()
```

### Safe Operations
- ✅ Read own conversations
- ✅ Create own conversations
- ✅ Update own conversations
- ✅ Delete own conversations
- ❌ Access other users' conversations

## 📊 Performance Tips

### 1. Use Indexes
All indexes are created automatically:
- `user_id` - Fast user queries
- `last_message_at` - Sorting by time
- `messages` (GIN) - Full-text search

### 2. Limit Results
```javascript
// ✅ Good: Paginate
const conversations = await getUserConversations(user.id, { limit: 20 })

// ❌ Bad: Load everything
const conversations = await getUserConversations(user.id, { limit: 9999 })
```

### 3. Select Only Needed Fields
```javascript
// ✅ Good: Select specific fields
const { data } = await supabase
  .from('user_conversations')
  .select('id, title, last_message_at')

// ❌ Bad: Select all including large JSONB
const { data } = await supabase
  .from('user_conversations')
  .select('*')
```

## 🆘 Troubleshooting

### Issue: Table doesn't exist
**Solution**: Run `CONVERSATIONS_QUICK_SETUP.sql` in Supabase SQL Editor

### Issue: Permission denied
**Solution**: Check RLS policies exist and user is authenticated

### Issue: Messages not updating count
**Solution**: Triggers should be created automatically. Check:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%conversation%';
```

### Issue: Slow queries
**Solution**: 
1. Check indexes exist
2. Use pagination
3. Select only needed fields
4. Don't load messages unless needed

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `supabase/CONVERSATIONS_QUICK_SETUP.sql` | Quick setup SQL |
| `supabase/migrations/002_create_user_conversations_table.sql` | Full migration |
| `src/lib/supabase/conversations.js` | Helper functions |

## 🚀 Next Steps

1. ✅ Run SQL setup in Supabase
2. ✅ Test with sample data
3. ✅ Integrate into your chat UI
4. ✅ Add real-time updates
5. ✅ Implement search functionality

---

**Ready to use!** All helper functions are in `src/lib/supabase/conversations.js`
