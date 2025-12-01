"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeExplorer } from "@/components/CodeExplorer";
import { RepositoryCard } from "@/components/RepositoryCard";
import { Canvas } from "@/components/Canvas";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  Download,
  MoreVertical,
  Edit2,
  RefreshCw,
  Mic,
  MicOff,
  ChevronDown,
  Trash,
  Settings,
  User,
  LogOut,
  Upload,
  Brain,
  SearchCheck,
  Github,
  Zap,
  Palette,
  Globe,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createConversation,
  getUserConversations,
  getConversation,
  addMessage,
  createMessage,
  deleteConversation,
  toggleConversationPin,
  archiveConversation,
  updateConversationTitle,
  updateMessage,
  deleteMessage,
  deleteAllConversations,
} from "@/lib/supabase/conversations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserProfile } from "@/lib/supabase/profiles";
import { Header } from "@/components/Header";
import ShareDialog from "@/components/ShareDialog";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { AIMessageRenderer } from "@/components/AIMessageRenderer";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const { openSettings } = useSettings();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState(null);
  const [model, setModel] = useState("SEFGH V1");
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [showGithubSearch, setShowGithubSearch] = useState(false);
  const [githubSearchQuery, setGithubSearchQuery] = useState("");
  const [githubSearchResults, setGithubSearchResults] = useState([]);
  const [searchingGithub, setSearchingGithub] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState("");
  const [canvasLanguage, setCanvasLanguage] = useState("javascript");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const isMobile = useIsMobile();

  // Function to handle opening code in canvas
  const handleOpenInCanvas = (code, language) => {
    console.log("Opening in canvas:", {
      code: code.substring(0, 50) + "...",
      language,
    });
    // Close canvas first if it's open to force re-render
    setShowCanvas(false);
    // Use setTimeout to ensure state updates
    setTimeout(() => {
      setCanvasContent(code);
      setCanvasLanguage(language || "javascript");
      setShowCanvas(true);
      toast.success("Code opened in Canvas!");
    }, 0);
  };

  // Function to handle repository selection from AI suggestions
  const handleSelectRepoFromAI = (repo) => {
    setSelectedRepo(repo);
    toast.success(`Opening ${repo.full_name} in Code Explorer`, {
      description: "Repository loaded successfully",
    });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login first", {
        description: "You need to be logged in to use AI chat",
      });
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Initialize voice recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript);
        toast.success("Voice captured!", { description: transcript });
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Voice input failed", { description: event.error });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (user) loadProfile();
  }, [user]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const convs = await getUserConversations(user.id, {
          limit: 50,
          orderBy: "last_message_at",
        });
        setConversations(convs);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadConversations();
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create new conversation
  const handleNewChat = async () => {
    if (!user) return;

    try {
      const conv = await createConversation(user.id, "New Conversation", null, {
        model,
      });
      setConversations([conv, ...conversations]);
      setCurrentConversation(conv);
      setMessages([]);
      setSidebarOpen(false);
      toast.success("New chat created!");
    } catch (error) {
      toast.error("Failed to create chat", {
        description: error.message,
      });
    }
  };

  // Clear all conversations
  const handleClearAll = async () => {
    try {
      await deleteAllConversations(user.id);
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      setClearDialogOpen(false);
      toast.success("All conversations cleared!");
    } catch (error) {
      toast.error("Failed to clear conversations", {
        description: error.message,
      });
    }
  };

  // Load conversation messages
  const loadConversation = async (convId) => {
    try {
      const conv = await getConversation(convId, user.id);
      setCurrentConversation(conv);
      setMessages(conv.messages || []);
      setSidebarOpen(false);
    } catch (error) {
      toast.error("Failed to load conversation", {
        description: error.message,
      });
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessageContent = input.trim();
    setInput("");

    // Create conversation if none exists
    let activeConversation = currentConversation;
    if (!activeConversation) {
      try {
        const conv = await createConversation(
          user.id,
          "New Conversation",
          null,
          {
            model,
          }
        );
        setConversations([conv, ...conversations]);
        setCurrentConversation(conv);
        setMessages([]);
        setSidebarOpen(false);
        activeConversation = conv;
      } catch (error) {
        toast.error("Failed to create chat", {
          description: error.message,
        });
        setInput(userMessageContent); // Restore input on error
        return;
      }
    }

    const isFirstMessage = messages.length === 0;
    setIsSending(true);

    try {
      // Add user message
      const userMsg = createMessage("user", userMessageContent, {
        tokens: userMessageContent.split(" ").length,
      });

      await addMessage(activeConversation.id, user.id, userMsg);
      setMessages((prev) => [...prev, userMsg]);

      // Generate title for first message
      if (isFirstMessage) {
        try {
          const titleResponse = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "user", content: userMessageContent }],
              action: "generate_title",
            }),
          });

          if (titleResponse.ok) {
            const { title } = await titleResponse.json();
            await updateConversationTitle(
              activeConversation.id,
              user.id,
              title
            );
            setCurrentConversation((prev) => ({ ...prev, title }));

            // Update in conversations list
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConversation.id ? { ...c, title } : c
              )
            );
          }
        } catch (error) {
          console.error("Error generating title:", error);
        }
      }

      // Get AI response
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiResponse = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!aiResponse.ok) {
        throw new Error("Failed to get AI response");
      }

      const { response } = await aiResponse.json();

      const aiMsg = createMessage("assistant", response, {
        model: "gpt-4o",
        tokens: response.split(" ").length,
      });

      await addMessage(activeConversation.id, user.id, aiMsg);
      setMessages((prev) => [...prev, aiMsg]);
      setIsSending(false);

      // Reload conversations to update last_message_at
      const convs = await getUserConversations(user.id, {
        limit: 50,
        orderBy: "last_message_at",
      });
      setConversations(convs);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: error.message,
      });
      setIsSending(false);
    }
  };

  // Delete conversation
  const handleDelete = async (convId) => {
    try {
      await deleteConversation(convId, user.id);
      setConversations(conversations.filter((c) => c.id !== convId));
      if (currentConversation?.id === convId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error("Failed to delete", {
        description: error.message,
      });
    }
  };

  // Pin conversation
  const handlePin = async (convId, isPinned) => {
    try {
      await toggleConversationPin(convId, user.id, !isPinned);
      const convs = await getUserConversations(user.id, {
        limit: 50,
        orderBy: "last_message_at",
      });
      setConversations(convs);
      toast.success(isPinned ? "Unpinned" : "Pinned");
    } catch (error) {
      toast.error("Failed to pin");
    }
  };

  // Download conversation
  const handleDownload = () => {
    const chatText = messages
      .map(
        (msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}\n---\n`
      )
      .join("\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${currentConversation?.title || "conversation"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat downloaded!");
  };

  // Copy message
  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied!");
  };

  // Edit message
  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) return;

    try {
      // Update the user message
      await updateMessage(
        currentConversation.id,
        user.id,
        messageId,
        editContent.trim()
      );

      // Update messages array
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: editContent.trim(), edited: true }
          : msg
      );
      setMessages(updatedMessages);

      setEditingMessageId(null);
      setEditContent("");
      toast.success("Message updated!");

      // Find the index of the edited message
      const editedMessageIndex = messages.findIndex(
        (msg) => msg.id === messageId
      );

      // If this is a user message, regenerate AI response
      if (messages[editedMessageIndex]?.role === "user") {
        // Remove all messages after the edited one
        const messagesUpToEdit = updatedMessages.slice(
          0,
          editedMessageIndex + 1
        );

        // Delete messages after the edited one from database and state
        const messagesToDelete = messages.slice(editedMessageIndex + 1);
        for (const msg of messagesToDelete) {
          try {
            await deleteMessage(currentConversation.id, user.id, msg.id);
          } catch (error) {
            console.error("Error deleting message:", error);
          }
        }

        setMessages(messagesUpToEdit);
        setIsSending(true);

        // Generate new AI response
        try {
          const chatHistory = messagesUpToEdit.map((m) => ({
            role: m.role,
            content: m.content,
          }));

          const aiResponse = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory }),
          });

          if (!aiResponse.ok) {
            throw new Error("Failed to get AI response");
          }

          const { response } = await aiResponse.json();

          const aiMsg = createMessage("assistant", response, {
            model: "gpt-4o",
            tokens: response.split(" ").length,
          });

          await addMessage(currentConversation.id, user.id, aiMsg);
          setMessages((prev) => [...prev, aiMsg]);

          toast.success("AI response regenerated!");
        } catch (error) {
          console.error("Error getting AI response:", error);
          toast.error("Failed to get AI response", {
            description: error.message,
          });
        } finally {
          setIsSending(false);
        }
      }
    } catch (error) {
      toast.error("Failed to update message", { description: error.message });
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(currentConversation.id, user.id, messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast.success("Message deleted!");
    } catch (error) {
      toast.error("Failed to delete message", { description: error.message });
    }
  };

  // Regenerate AI response
  const handleRegenerateResponse = async (messageId) => {
    setRegeneratingMessageId(messageId);

    try {
      // Find the message and get context up to that point
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      const chatHistory = messages.slice(0, messageIndex).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Get new AI response
      const aiResponse = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!aiResponse.ok) {
        throw new Error("Failed to regenerate response");
      }

      const { response } = await aiResponse.json();

      // Update the message
      await updateMessage(currentConversation.id, user.id, messageId, response);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: response } : msg
        )
      );

      toast.success("Response regenerated!");
    } catch (error) {
      console.error("Error regenerating:", error);
      toast.error("Failed to regenerate", { description: error.message });
    } finally {
      setRegeneratingMessageId(null);
    }
  };

  // Voice input
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input not supported", {
        description: "Your browser doesn't support voice recognition",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Listening...", { description: "Speak now" });
      } catch (error) {
        console.error("Error starting recognition:", error);
        toast.error("Failed to start voice input");
      }
    }
  };

  // Start editing a message
  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  // GitHub search function
  const handleGithubSearch = async () => {
    if (!githubSearchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setSearchingGithub(true);
    try {
      const params = new URLSearchParams({
        q: githubSearchQuery,
        per_page: "12",
      });

      const response = await fetch(`/api/github/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setGithubSearchResults(data.items || []);
        if (data.items.length === 0) {
          toast.info("No repositories found");
        }
      } else {
        throw new Error(data.error || "Search failed");
      }
    } catch (error) {
      console.error("GitHub search error:", error);
      toast.error("Failed to search repositories");
    } finally {
      setSearchingGithub(false);
    }
  };

  // Handle repository selection
  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setShowGithubSearch(false);
    toast.success("Repository opened in sidebar");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        {sidebarOpen && (
          <div className="hidden md:flex md:w-64 lg:w-80 flex-col m-4 mr-0 gap-3">
            {/* Version Selector Header - Floating */}
            <div className="glass-premium rounded-2xl shadow-premium border border-white/10 p-4 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-between h-9 hover:shadow-glow-blue"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-sm">{model}</span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 glass-premium border-white/10"
                >
                  <DropdownMenuLabel>Select Version</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setModel("SEFGH V1");
                      toast.success("Version changed to SEFGH V1");
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
                    <span>SEFGH V1</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setModel("SEFGH V2");
                      toast.success("Version changed to SEFGH V2");
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
                    <span>SEFGH V2</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setModel("SEFGH V3");
                      toast.success("Version changed to SEFGH V3");
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-cyan-600" />
                    <span>SEFGH V3</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Removed top-right close button */}
            </div>

            {/* Conversations List - Floating */}
            <div className="glass-premium rounded-2xl shadow-premium border border-white/10 flex-1 flex flex-col overflow-hidden">
              {/* New Chat Button */}
              <div className="p-4 border-b border-white/10">
                <Button
                  onClick={handleNewChat}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-glow-blue"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>

              {/* Conversations List */}
              <ScrollArea className="flex-1 p-3">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No conversations yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start a new chat to begin
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`group relative p-3 rounded-xl cursor-pointer transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:shadow-glow-blue/50 ${
                          currentConversation?.id === conv.id
                            ? "bg-blue-50 dark:bg-blue-950/30 shadow-glow-blue border border-blue-200/50 dark:border-blue-800/50"
                            : ""
                        }`}
                        onClick={() => loadConversation(conv.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium truncate">
                                {conv.title}
                              </h3>
                              {conv.is_pinned && (
                                <Pin className="h-3 w-3 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {conv.total_messages} messages
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePin(conv.id, conv.is_pinned);
                              }}
                            >
                              <Pin className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(conv.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Bottom Section */}
              <div className="border-t border-white/10 mt-auto">
                {/* Clear All Button */}
                {conversations.length > 0 && (
                  <div className="p-3 border-b border-white/10">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => setClearDialogOpen(true)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear All Conversations
                    </Button>
                  </div>
                )}

                {/* User Profile */}
                <div className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-2 h-auto hover:bg-accent"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-9 w-9">
                            {userProfile?.avatar_url ? (
                              <AvatarImage
                                src={userProfile.avatar_url}
                                alt={userProfile.full_name}
                              />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-600 text-white text-sm">
                              {userProfile?.full_name?.[0]?.toUpperCase() ||
                                user?.email?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium truncate">
                              {userProfile?.full_name ||
                                user?.email?.split("@")[0] ||
                                "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="top"
                      className="w-56 mb-2"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {userProfile?.full_name ||
                              user?.email?.split("@")[0] ||
                              "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={openSettings}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            const userName =
                              userProfile?.full_name ||
                              user?.email?.split("@")[0] ||
                              "User";
                            await user.signOut?.();
                            toast.success(`Goodbye, ${userName}! 👋`, {
                              description:
                                "You've been signed out successfully.",
                            });
                            router.push("/");
                          } catch (error) {
                            toast.error("Sign out failed", {
                              description: error.message,
                            });
                          }
                        }}
                        className="text-destructive cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Dialog */}
        <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Conversations?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your conversations. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive hover:bg-destructive/90"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Main Chat Area */}
        <div
          className={`flex-1 flex flex-col transition-all p-4 ${
            showCanvas || selectedRepo ? "lg:mr-[50vw]" : ""
          }`}
        >
          {/* Header - Floating */}
          <div className="glass-premium rounded-2xl shadow-premium border border-white/10 h-14 px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Back to search"
                onClick={() => router.push("/search")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {/* Sidebar Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle sidebar"
                onClick={() => {
                  if (isMobile) setSidebarOpen(true);
                  else setSidebarOpen(!sidebarOpen);
                }}
                className="md:flex"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Mobile Menu Sheet */}
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetContent
                    side="left"
                    className="w-80 p-0 flex flex-col [&>button]:hidden"
                  >
                    {/* Version Selector Header */}
                    <div className="p-4 border-b flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-between h-9 hover:shadow-glow-blue"
                          >
                            <span className="flex items-center gap-2">
                              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium text-sm">
                                {model}
                              </span>
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-56 glass-premium border-white/10"
                        >
                          <DropdownMenuLabel>Select Version</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setModel("SEFGH V1");
                              toast.success("Version changed to SEFGH V1");
                              setSidebarOpen(false);
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
                            <span>SEFGH V1</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setModel("SEFGH V2");
                              toast.success("Version changed to SEFGH V2");
                              setSidebarOpen(false);
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
                            <span>SEFGH V2</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setModel("SEFGH V3");
                              toast.success("Version changed to SEFGH V3");
                              setSidebarOpen(false);
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4 text-cyan-600" />
                            <span>SEFGH V3</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Removed top-right close button */}
                    </div>

                    {/* New Chat Button */}
                    <div className="p-4 border-b">
                      <Button
                        onClick={() => {
                          handleNewChat();
                          setSidebarOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-glow-blue"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Chat
                      </Button>
                    </div>

                    {/* Conversations List */}
                    <ScrollArea className="flex-1 px-4 py-3">
                      {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            No conversations yet
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {conversations.map((conv) => (
                            <div
                              key={conv.id}
                              className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:shadow-glow-blue/50 ${
                                currentConversation?.id === conv.id
                                  ? "bg-blue-50 dark:bg-blue-950/30 shadow-glow-blue border border-blue-200/50 dark:border-blue-800/50"
                                  : ""
                              }`}
                              onClick={() => {
                                loadConversation(conv.id);
                                setSidebarOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium truncate flex-1">
                                  {conv.title}
                                </h3>
                                {conv.is_pinned && (
                                  <Pin className="h-3 w-3 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {conv.total_messages} messages
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Bottom Section */}
                    <div className="border-t mt-auto">
                      {/* Clear All - Bottom */}
                      {conversations.length > 0 && (
                        <div className="p-3 border-b">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => {
                              setClearDialogOpen(true);
                              setSidebarOpen(false);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Clear All Conversations
                          </Button>
                        </div>
                      )}

                      {/* User Profile */}
                      <div className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start p-2 h-auto hover:bg-accent"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <Avatar className="h-9 w-9">
                                  {userProfile?.avatar_url ? (
                                    <AvatarImage
                                      src={userProfile.avatar_url}
                                      alt={userProfile.full_name}
                                    />
                                  ) : null}
                                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-600 text-white text-sm">
                                    {userProfile?.full_name?.[0]?.toUpperCase() ||
                                      user?.email?.[0]?.toUpperCase() ||
                                      "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 text-left">
                                  <p className="text-sm font-medium truncate">
                                    {userProfile?.full_name ||
                                      user?.email?.split("@")[0] ||
                                      "User"}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                  </p>
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            side="top"
                            className="w-56 mb-2"
                          >
                            <DropdownMenuLabel>
                              <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {userProfile?.full_name ||
                                    user?.email?.split("@")[0] ||
                                    "User"}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                  {user?.email}
                                </p>
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/profile" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  const userName =
                                    userProfile?.full_name ||
                                    user?.email?.split("@")[0] ||
                                    "User";
                                  await user.signOut?.();
                                  toast.success(`Goodbye, ${userName}! 👋`, {
                                    description:
                                      "You've been signed out successfully.",
                                  });
                                  router.push("/");
                                } catch (error) {
                                  toast.error("Sign out failed", {
                                    description: error.message,
                                  });
                                }
                              }}
                              className="text-destructive cursor-pointer"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Log out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {/* Title Section */}
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h1 className="text-lg font-semibold">
                  {currentConversation?.title || "AI Chat"}
                </h1>
                {showCanvas && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                  >
                    <Palette className="h-3 w-3 mr-1" />
                    Canvas
                  </Badge>
                )}
                {selectedRepo && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
                  >
                    <Github className="h-3 w-3 mr-1" />
                    Repository
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Close Canvas Button */}
              {showCanvas && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCanvas(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Close Canvas
                </Button>
              )}

              {/* Close Repository Button */}
              {selectedRepo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRepo(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Close Repository
                </Button>
              )}

              {/* Share Button - Only shown when there are messages */}
              {currentConversation && messages.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Share</span>
                  </Button>
                  <ShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    conversation={currentConversation}
                    snapshot={messages}
                    onAfterShare={() => {}}
                  />
                </>
              )}
            </div>
          </div>

          {/* Messages Area - Floating */}
          <div className="glass-premium rounded-2xl shadow-premium border border-white/10 flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {!currentConversation ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="p-8 rounded-full bg-blue-100 dark:bg-blue-950/30 mb-6">
                    <Sparkles className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3">
                    Welcome to AI Chat
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md text-base">
                    Start a new conversation or select an existing one from the
                    sidebar
                  </p>
                  <Button
                    onClick={handleNewChat}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-glow-blue"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Start New Chat
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="p-6 rounded-full bg-muted mb-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No messages yet
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Send a message below to start the conversation
                  </p>
                </div>
              ) : (
                <div className="max-w-6xl mx-auto space-y-6">
                  <TooltipProvider>
                    {messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`group flex gap-3 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700 text-white">
                              <Sparkles className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`flex flex-col ${
                            message.role === "user"
                              ? "items-end"
                              : "items-start"
                          } max-w-[90%]`}
                        >
                          {/* Message Content */}
                          {editingMessageId === message.id ? (
                            <div className="w-full">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="min-h-[100px] mb-2"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleEditMessage(message.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingMessageId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              {/* Message Actions - Left side for user, Right side for AI */}
                              {message.role === "user" && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-2">
                                      <div className="flex flex-col gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="justify-start"
                                          onClick={() =>
                                            handleCopyMessage(message.content)
                                          }
                                        >
                                          <Copy className="h-3 w-3 mr-2" />
                                          Copy
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="justify-start"
                                          onClick={() => startEditing(message)}
                                        >
                                          <Edit2 className="h-3 w-3 mr-2" />
                                          Edit
                                        </Button>
                                        <Separator className="my-1" />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="justify-start text-destructive"
                                          onClick={() =>
                                            handleDeleteMessage(message.id)
                                          }
                                        >
                                          <Trash2 className="h-3 w-3 mr-2" />
                                          Delete
                                        </Button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )}

                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  message.role === "user"
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-glow-blue"
                                    : "glass-premium border border-white/10"
                                }`}
                              >
                                {/* Render with AIMessageRenderer for AI, markdown for user */}
                                {message.role === "assistant" ? (
                                  <AIMessageRenderer
                                    content={message.content}
                                    onOpenInCanvas={handleOpenInCanvas}
                                    onSelectRepo={handleSelectRepoFromAI}
                                  />
                                ) : (
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-xs opacity-70">
                                    {new Date(
                                      message.timestamp
                                    ).toLocaleTimeString()}
                                  </p>
                                  {message.edited && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs h-4 px-1"
                                    >
                                      edited
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Message Actions - Right side for AI */}
                              {message.role === "assistant" && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-2">
                                      <div className="flex flex-col gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="justify-start"
                                          onClick={() =>
                                            handleCopyMessage(message.content)
                                          }
                                        >
                                          <Copy className="h-3 w-3 mr-2" />
                                          Copy
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="justify-start"
                                          onClick={() =>
                                            handleRegenerateResponse(message.id)
                                          }
                                          disabled={
                                            regeneratingMessageId === message.id
                                          }
                                        >
                                          <RefreshCw
                                            className={`h-3 w-3 mr-2 ${
                                              regeneratingMessageId ===
                                              message.id
                                                ? "animate-spin"
                                                : ""
                                            }`}
                                          />
                                          Regenerate
                                        </Button>
                                        <Separator className="my-1" />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="justify-start text-destructive"
                                          onClick={() =>
                                            handleDeleteMessage(message.id)
                                          }
                                        >
                                          <Trash2 className="h-3 w-3 mr-2" />
                                          Delete
                                        </Button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            {userProfile?.avatar_url ? (
                              <AvatarImage
                                src={userProfile.avatar_url}
                                alt={userProfile.full_name}
                              />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-600 text-white">
                              {userProfile?.full_name?.[0]?.toUpperCase() ||
                                user?.email?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </TooltipProvider>
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
          </div>

          {/* Input Area - Floating */}
          <div className="glass-premium rounded-2xl shadow-premium border border-white/10 p-4 mt-4">
            <div className="flex gap-2">
              {/* + Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 flex-shrink-0 hover:shadow-glow-blue"
                    aria-label="Open quick actions"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 glass-premium border-white/10"
                >
                  <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Upload repo", { description: "Coming soon" })
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload repo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Enhance", { description: "Coming soon" })
                    }
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Enhance</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Think longer", { description: "Coming soon" })
                    }
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    <span>Think longer</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Deep research", {
                        description: "Coming soon",
                      })
                    }
                  >
                    <SearchCheck className="mr-2 h-4 w-4" />
                    <span>Deep research</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowGithubSearch(true)}>
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub search</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Quick answer", { description: "Coming soon" })
                    }
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Quick answer</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCanvas(!showCanvas)}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>{showCanvas ? "Close Canvas" : "Open Canvas"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Web search", { description: "Coming soon" })
                    }
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Web search</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Input Field */}
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder={
                    currentConversation
                      ? "Type your message..."
                      : "Start a new chat..."
                  }
                  className="h-11 pr-12"
                  disabled={isSending}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 ${
                          isRecording ? "text-red-500 animate-pulse" : ""
                        }`}
                        onClick={handleVoiceInput}
                        disabled={isSending}
                      >
                        {isRecording ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isRecording ? "Stop recording" : "Voice input"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                size="icon"
                className="h-11 w-11 flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-glow-blue"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Help Text */}
            {currentConversation && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  Enter to send • Shift+Enter for new line • + for features • 🎤
                  for voice
                </p>
              </div>
            )}
          </div>
        </div>

        {/* GitHub Search Dialog */}
        <Dialog open={showGithubSearch} onOpenChange={setShowGithubSearch}>
          <DialogContent className="max-w-4xl max-h-[80vh] glass-premium border-white/10">
            <DialogHeader>
              <DialogTitle className="text-blue-900 dark:text-blue-100">
                Search GitHub Repositories
              </DialogTitle>
              <DialogDescription>
                Search for repositories to explore in the canvas
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={githubSearchQuery}
                    onChange={(e) => setGithubSearchQuery(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleGithubSearch()
                    }
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleGithubSearch}
                  disabled={searchingGithub}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-glow-blue"
                >
                  {searchingGithub ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Search Results */}
              <ScrollArea className="h-[400px] pr-4">
                {searchingGithub ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-xl border bg-card animate-pulse"
                      >
                        <div className="h-6 bg-muted rounded mb-3 w-3/4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded mb-4 w-5/6"></div>
                        <div className="flex gap-4">
                          <div className="h-4 bg-muted rounded w-16"></div>
                          <div className="h-4 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : githubSearchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {githubSearchResults.map((repo) => (
                      <RepositoryCard
                        key={repo.id}
                        repo={repo}
                        onSelect={handleSelectRepo}
                      />
                    ))}
                  </div>
                ) : githubSearchQuery && !searchingGithub ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Github className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No repositories found</p>
                    <p className="text-sm mt-1">Try a different search query</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Github className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Search for GitHub repositories</p>
                    <p className="text-sm mt-1">
                      Enter a query above to get started
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {/* Canvas Panel (Code Editor) - Desktop */}
        {showCanvas && !selectedRepo && (
          <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-1/2 bg-background border-l shadow-2xl z-40">
            <Canvas
              key={canvasContent + canvasLanguage}
              content={canvasContent}
              onChange={setCanvasContent}
              onClose={() => setShowCanvas(false)}
              initialLanguage={canvasLanguage}
            />
          </div>
        )}

        {/* Repository Search Panel (Canvas 1) - Desktop */}
        {selectedRepo && (
          <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-1/2 bg-background border-l shadow-2xl z-40">
            <CodeExplorer
              repository={selectedRepo}
              onClose={() => setSelectedRepo(null)}
            />
          </div>
        )}

        {/* Canvas Panel (Code Editor) - Mobile */}
        {showCanvas && !selectedRepo && (
          <div className="lg:hidden fixed inset-0 bg-background z-50">
            <Canvas
              key={canvasContent + canvasLanguage}
              content={canvasContent}
              onChange={setCanvasContent}
              onClose={() => setShowCanvas(false)}
              initialLanguage={canvasLanguage}
            />
          </div>
        )}

        {/* Repository Search Panel (Canvas 1) - Mobile */}
        {selectedRepo && (
          <div className="lg:hidden fixed inset-0 bg-background z-50">
            <CodeExplorer
              repository={selectedRepo}
              onClose={() => setSelectedRepo(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
