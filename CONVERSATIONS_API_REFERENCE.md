# 💬 Conversations API - Quick Reference

## 📋 Table of Contents
- [Message Format](#message-format)
- [Helper Functions](#helper-functions)
- [Common Patterns](#common-patterns)
- [React Integration](#react-integration)

---

## Message Format

### Standard Message Object
```javascript
{
  id: "msg_1730123456789_abc123",     // Unique ID
  role: "user" | "assistant" | "system",  // Message role
  content: "Message text here",        // Message content
  timestamp: "2025-10-31T10:30:00Z",  // ISO 8601
  tokens: 15,                         // Optional: token count
  model: "gpt-4",                     // Optional: AI model
  metadata: {                         // Optional: custom data
    source: "web",
    language: "en"
  }
}
```

### Creating Messages
```javascript
import { createMessage } from '@/lib/supabase/conversations'

// Simple message
const msg = createMessage('user', 'Hello!')

// With options
const msg = createMessage('assistant', 'Hi there!', {
  model: 'gpt-4',
  tokens: 5,
  metadata: { source: 'api' }
})
```

---

## Helper Functions

### 📝 Create Operations

#### Create Conversation
```javascript
import { createConversation, createMessage } from '@/lib/supabase/conversations'

// Empty conversation
const conv = await createConversation(user.id, 'My Chat')

// With initial message
const msg = createMessage('user', 'Hello!')
const conv = await createConversation(user.id, 'My Chat', msg)
```

#### Add Message
```javascript
import { addMessage, createMessage } from '@/lib/supabase/conversations'

const message = createMessage('user', 'What is React?')
await addMessage(conversationId, user.id, message)
```

### 🔍 Read Operations

#### Get All Conversations
```javascript
import { getUserConversations } from '@/lib/supabase/conversations'

// Default options
const conversations = await getUserConversations(user.id)

// With options
const conversations = await getUserConversations(user.id, {
  limit: 20,          // Default: 20
  offset: 0,          // Default: 0
  status: 'active',   // Default: 'active'
  orderBy: 'last_message_at',  // Default
  ascending: false    // Default: false (newest first)
})
```

#### Get Single Conversation
```javascript
import { getConversation } from '@/lib/supabase/conversations'

const conversation = await getConversation(conversationId, user.id)
// Returns: { id, title, messages: [...], total_messages, ... }
```

#### Search Conversations
```javascript
import { searchConversations } from '@/lib/supabase/conversations'

const results = await searchConversations(user.id, 'React', 10)
// Searches in title and message content
```

#### Get Statistics
```javascript
import { getConversationStats } from '@/lib/supabase/conversations'

const stats = await getConversationStats(user.id)
// Returns: { total, active, archived, totalMessages, totalTokens }
```

### ✏️ Update Operations

#### Update Title
```javascript
import { updateConversationTitle } from '@/lib/supabase/conversations'

await updateConversationTitle(conversationId, user.id, 'New Title')
```

#### Pin/Unpin
```javascript
import { toggleConversationPin } from '@/lib/supabase/conversations'

await toggleConversationPin(conversationId, user.id, true)  // Pin
await toggleConversationPin(conversationId, user.id, false) // Unpin
```

#### Archive
```javascript
import { archiveConversation } from '@/lib/supabase/conversations'

await archiveConversation(conversationId, user.id)
```

### 🗑️ Delete Operations

#### Delete Permanently
```javascript
import { deleteConversation } from '@/lib/supabase/conversations'

await deleteConversation(conversationId, user.id)
```

### 🔴 Real-time Operations

#### Subscribe to Conversation
```javascript
import { subscribeToConversation, unsubscribeFromConversation } from '@/lib/supabase/conversations'

const channel = subscribeToConversation(conversationId, (payload) => {
  console.log('Event:', payload.eventType) // INSERT, UPDATE, DELETE
  console.log('New data:', payload.new)
  console.log('Old data:', payload.old)
})

// Cleanup
await unsubscribeFromConversation(channel)
```

#### Subscribe to All User Conversations
```javascript
import { subscribeToUserConversations } from '@/lib/supabase/conversations'

const channel = subscribeToUserConversations(user.id, (payload) => {
  if (payload.eventType === 'INSERT') {
    // New conversation created
  } else if (payload.eventType === 'UPDATE') {
    // Conversation updated
  } else if (payload.eventType === 'DELETE') {
    // Conversation deleted
  }
})
```

---

## Common Patterns

### Pattern 1: Chat Interface

```javascript
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  createConversation, 
  getConversation, 
  addMessage, 
  createMessage 
} from '@/lib/supabase/conversations'

export default function ChatInterface() {
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // Create or load conversation
  useEffect(() => {
    const initChat = async () => {
      // Create new conversation
      const conv = await createConversation(user.id, 'New Chat')
      setConversationId(conv.id)
      setMessages(conv.messages)
    }
    
    if (user) initChat()
  }, [user])

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMsg = createMessage('user', input)
    await addMessage(conversationId, user.id, userMsg)
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate AI response
    const aiMsg = createMessage('assistant', 'AI response here', {
      model: 'gpt-4',
      tokens: 20
    })
    await addMessage(conversationId, user.id, aiMsg)
    setMessages(prev => [...prev, aiMsg])
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
```

### Pattern 2: Conversation List

```javascript
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserConversations } from '@/lib/supabase/conversations'
import Link from 'next/link'

export default function ConversationList() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const loadConversations = async () => {
      const convs = await getUserConversations(user.id, {
        limit: 50,
        orderBy: 'last_message_at'
      })
      setConversations(convs)
    }
    
    if (user) loadConversations()
  }, [user])

  return (
    <div className="conversation-list">
      {conversations.map(conv => (
        <Link 
          key={conv.id} 
          href={`/chat/${conv.id}`}
          className="conversation-item"
        >
          <div className="flex justify-between">
            <h3>{conv.title}</h3>
            {conv.is_pinned && <span>📌</span>}
          </div>
          <p className="text-sm text-muted-foreground">
            {conv.total_messages} messages
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(conv.last_message_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  )
}
```

### Pattern 3: Real-time Chat

```javascript
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getConversation, 
  subscribeToConversation,
  unsubscribeFromConversation 
} from '@/lib/supabase/conversations'

export default function RealtimeChat({ conversationId }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    let channel

    const setupChat = async () => {
      // Load initial messages
      const conv = await getConversation(conversationId, user.id)
      setMessages(conv.messages)

      // Subscribe to updates
      channel = subscribeToConversation(conversationId, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setMessages(payload.new.messages)
        }
      })
    }

    if (user) setupChat()

    // Cleanup
    return () => {
      if (channel) unsubscribeFromConversation(channel)
    }
  }, [conversationId, user])

  return (
    <div className="messages">
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
```

### Pattern 4: Search Functionality

```javascript
'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { searchConversations } from '@/lib/supabase/conversations'

export default function SearchBar() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (searchTerm) => {
    setQuery(searchTerm)
    
    if (searchTerm.length < 2) {
      setResults([])
      return
    }

    const found = await searchConversations(user.id, searchTerm, 10)
    setResults(found)
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search conversations..."
      />
      <div className="search-results">
        {results.map(conv => (
          <div key={conv.id}>{conv.title}</div>
        ))}
      </div>
    </div>
  )
}
```

### Pattern 5: Pagination

```javascript
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserConversations } from '@/lib/supabase/conversations'

export default function PaginatedList() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 20

  const loadPage = async (pageNum) => {
    const convs = await getUserConversations(user.id, {
      limit: LIMIT,
      offset: pageNum * LIMIT
    })
    
    if (convs.length < LIMIT) {
      setHasMore(false)
    }
    
    setConversations(prev => [...prev, ...convs])
    setPage(pageNum)
  }

  useEffect(() => {
    if (user) loadPage(0)
  }, [user])

  return (
    <div>
      {conversations.map(conv => (
        <div key={conv.id}>{conv.title}</div>
      ))}
      {hasMore && (
        <button onClick={() => loadPage(page + 1)}>
          Load More
        </button>
      )}
    </div>
  )
}
```

---

## React Integration

### Custom Hook: useConversation

```javascript
import { useState, useEffect } from 'react'
import { 
  getConversation, 
  addMessage, 
  createMessage,
  subscribeToConversation,
  unsubscribeFromConversation
} from '@/lib/supabase/conversations'

export function useConversation(conversationId, userId) {
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel

    const init = async () => {
      try {
        const conv = await getConversation(conversationId, userId)
        setConversation(conv)
        setMessages(conv.messages)

        // Subscribe to real-time updates
        channel = subscribeToConversation(conversationId, (payload) => {
          if (payload.eventType === 'UPDATE') {
            setMessages(payload.new.messages)
            setConversation(payload.new)
          }
        })
      } catch (error) {
        console.error('Error loading conversation:', error)
      } finally {
        setLoading(false)
      }
    }

    if (conversationId && userId) init()

    return () => {
      if (channel) unsubscribeFromConversation(channel)
    }
  }, [conversationId, userId])

  const sendMessage = async (content, role = 'user', options = {}) => {
    const message = createMessage(role, content, options)
    await addMessage(conversationId, userId, message)
    // Messages will update via real-time subscription
  }

  return { conversation, messages, loading, sendMessage }
}
```

### Custom Hook: useConversationList

```javascript
import { useState, useEffect } from 'react'
import { getUserConversations } from '@/lib/supabase/conversations'

export function useConversationList(userId, options = {}) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    setLoading(true)
    try {
      const convs = await getUserConversations(userId, options)
      setConversations(convs)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) reload()
  }, [userId])

  return { conversations, loading, reload }
}
```

---

## 📊 Response Formats

### Get Conversations Response
```javascript
[
  {
    id: "uuid",
    title: "Conversation Title",
    total_messages: 15,
    total_tokens: 450,
    last_message_at: "2025-10-31T10:30:00Z",
    is_pinned: false,
    created_at: "2025-10-30T08:00:00Z",
    status: "active"
  }
]
```

### Get Conversation Response
```javascript
{
  id: "uuid",
  user_id: "uuid",
  title: "Conversation Title",
  messages: [...], // Full array of messages
  model: "gpt-4",
  total_tokens: 450,
  total_messages: 15,
  status: "active",
  is_pinned: false,
  created_at: "2025-10-30T08:00:00Z",
  updated_at: "2025-10-31T10:30:00Z",
  last_message_at: "2025-10-31T10:30:00Z"
}
```

### Statistics Response
```javascript
{
  total: 25,           // Total conversations
  active: 20,          // Active conversations
  archived: 5,         // Archived conversations
  totalMessages: 850,  // Total messages across all
  totalTokens: 24500   // Total tokens used
}
```

---

## 🎯 Best Practices

1. **Always use helper functions** - Don't write raw SQL
2. **Handle errors** - Wrap in try-catch blocks
3. **Use pagination** - Don't load all conversations at once
4. **Create proper messages** - Use `createMessage()` helper
5. **Clean up subscriptions** - Always unsubscribe in cleanup
6. **Validate user input** - Check message content before sending
7. **Track tokens** - Update `total_tokens` when using AI APIs

---

**Full Documentation**: See `CONVERSATIONS_SETUP.md`
