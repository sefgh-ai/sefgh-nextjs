'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Menu, 
  Plus, 
  MessageSquare, 
  Share2, 
  Trash2, 
  Pin, 
  Archive,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Download
} from "lucide-react"
import { toast } from "sonner"
import { 
  createConversation, 
  getUserConversations, 
  getConversation,
  addMessage, 
  createMessage,
  deleteConversation,
  toggleConversationPin,
  archiveConversation
} from "@/lib/supabase/conversations"
import { Header } from "@/components/Header"

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login first", {
        description: "You need to be logged in to use AI chat",
      })
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return
      setLoading(true)
      try {
        const convs = await getUserConversations(user.id, {
          limit: 50,
          orderBy: 'last_message_at'
        })
        setConversations(convs)
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) loadConversations()
  }, [user])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Create new conversation
  const handleNewChat = async () => {
    if (!user) return
    
    try {
      const conv = await createConversation(user.id, 'New Conversation')
      setConversations([conv, ...conversations])
      setCurrentConversation(conv)
      setMessages([])
      setSidebarOpen(false)
      toast.success("New chat created!")
    } catch (error) {
      toast.error("Failed to create chat", {
        description: error.message
      })
    }
  }

  // Load conversation messages
  const loadConversation = async (convId) => {
    try {
      const conv = await getConversation(convId, user.id)
      setCurrentConversation(conv)
      setMessages(conv.messages || [])
      setSidebarOpen(false)
    } catch (error) {
      toast.error("Failed to load conversation", {
        description: error.message
      })
    }
  }

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isSending) return

    // Create conversation if none exists
    if (!currentConversation) {
      await handleNewChat()
      return
    }

    const userMessageContent = input.trim()
    setInput('')
    setIsSending(true)

    try {
      // Add user message
      const userMsg = createMessage('user', userMessageContent, {
        tokens: userMessageContent.split(' ').length
      })
      
      await addMessage(currentConversation.id, user.id, userMsg)
      setMessages(prev => [...prev, userMsg])

      // Simulate AI response (replace with actual API call)
      setTimeout(async () => {
        const aiResponse = `I received your message: "${userMessageContent}". This is a simulated AI response. Please integrate with your preferred AI API (OpenAI, Anthropic, etc.) for real responses.`
        
        const aiMsg = createMessage('assistant', aiResponse, {
          model: 'gpt-4',
          tokens: aiResponse.split(' ').length
        })

        await addMessage(currentConversation.id, user.id, aiMsg)
        setMessages(prev => [...prev, aiMsg])
        setIsSending(false)

        // Reload conversations to update last_message_at
        const convs = await getUserConversations(user.id, {
          limit: 50,
          orderBy: 'last_message_at'
        })
        setConversations(convs)
      }, 1000)

    } catch (error) {
      toast.error("Failed to send message", {
        description: error.message
      })
      setIsSending(false)
    }
  }

  // Delete conversation
  const handleDelete = async (convId) => {
    try {
      await deleteConversation(convId, user.id)
      setConversations(conversations.filter(c => c.id !== convId))
      if (currentConversation?.id === convId) {
        setCurrentConversation(null)
        setMessages([])
      }
      toast.success("Conversation deleted")
    } catch (error) {
      toast.error("Failed to delete", {
        description: error.message
      })
    }
  }

  // Pin conversation
  const handlePin = async (convId, isPinned) => {
    try {
      await toggleConversationPin(convId, user.id, !isPinned)
      const convs = await getUserConversations(user.id, {
        limit: 50,
        orderBy: 'last_message_at'
      })
      setConversations(convs)
      toast.success(isPinned ? "Unpinned" : "Pinned")
    } catch (error) {
      toast.error("Failed to pin")
    }
  }

  // Share conversation
  const handleShare = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
    ).join('\n\n')

    navigator.clipboard.writeText(chatText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Chat copied to clipboard!")
  }

  // Download conversation
  const handleDownload = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}\n---\n`
    ).join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${currentConversation?.title || 'conversation'}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Chat downloaded!")
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 lg:w-80 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <Button onClick={handleNewChat} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                  currentConversation?.id === conv.id ? 'bg-accent' : ''
                }`}
                onClick={() => loadConversation(conv.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium truncate">
                        {conv.title}
                      </h3>
                      {conv.is_pinned && (
                        <Pin className="h-3 w-3 text-primary fill-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conv.total_messages} messages
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePin(conv.id, conv.is_pinned)
                      }}
                    >
                      <Pin className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(conv.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Header />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-card px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Conversations</SheetTitle>
                  <SheetDescription>
                    Your AI chat history
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <Button onClick={handleNewChat} className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-180px)] px-4">
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                          currentConversation?.id === conv.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => loadConversation(conv.id)}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-medium truncate flex-1">
                            {conv.title}
                          </h3>
                          {conv.is_pinned && (
                            <Pin className="h-3 w-3 text-primary fill-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conv.total_messages} messages
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">
                {currentConversation?.title || 'AI Chat'}
              </h1>
              {currentConversation && (
                <Badge variant="secondary">
                  {messages.length} messages
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentConversation && messages.length > 0 && (
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Conversation</DialogTitle>
                    <DialogDescription>
                      Copy the conversation or download as text file
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleShare} 
                        className="flex-1"
                        variant={copied ? "secondary" : "default"}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={handleDownload} 
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        This will copy/download {messages.length} messages from this conversation.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <div className="hidden md:block">
              <Header />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          {!currentConversation ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="p-6 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start a new conversation or select an existing one from the sidebar
              </p>
              <Button onClick={handleNewChat} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Start New Chat
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-3 rounded-lg max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="px-4 py-3 rounded-lg bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={currentConversation ? "Type your message..." : "Start a new chat..."}
                className="flex-1"
                disabled={isSending}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isSending}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {currentConversation ? 'Press Enter to send, Shift+Enter for new line' : 'Create a new chat to start'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
