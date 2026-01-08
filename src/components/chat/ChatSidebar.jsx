"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  MessageSquare,
  Pin,
  Trash2,
  Trash,
  Settings,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ChatSidebar({
  sidebarOpen,
  setSidebarOpen,
  model,
  setModel,
  conversations,
  currentConversation,
  handleNewChat,
  loadConversation,
  handlePin,
  handleDelete,
  setClearDialogOpen,
  userProfile,
  user,
  isMobile,
}) {
  const router = useRouter();

  const handleModelChange = (newModel) => {
    setModel(newModel);
    toast.success(`Version changed to ${newModel}`);
  };

  const ModelSelector = ({ onClose }) => (
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
            handleModelChange("SEFGH V1");
            onClose?.();
          }}
        >
          <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
          <span>SEFGH V1</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleModelChange("SEFGH V2");
            onClose?.();
          }}
        >
          <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
          <span>SEFGH V2</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleModelChange("SEFGH V3");
            onClose?.();
          }}
        >
          <Sparkles className="mr-2 h-4 w-4 text-cyan-600" />
          <span>SEFGH V3</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ConversationsList = ({ onSelectConversation }) => (
    <ScrollArea className="flex-1 p-3">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">No conversations yet</p>
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
              onClick={() => onSelectConversation(conv.id)}
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
  );

  const UserProfileSection = () => (
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
        <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userProfile?.full_name || user?.email?.split("@")[0] || "User"}
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
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
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
                  description: "You've been signed out successfully.",
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
  );

  const SidebarContent = ({ onClose }) => (
    <>
      {/* Version Selector Header */}
      <div
        className={
          onClose
            ? "p-4 border-b flex items-center gap-2"
            : "glass-premium rounded-2xl shadow-premium border border-white/10 p-4 flex items-center gap-2"
        }
      >
        <ModelSelector onClose={onClose} />
      </div>

      {/* Conversations List */}
      <div
        className={
          onClose
            ? "flex-1 flex flex-col overflow-hidden"
            : "glass-premium rounded-2xl shadow-premium border border-white/10 flex-1 flex flex-col overflow-hidden"
        }
      >
        {/* New Chat Button */}
        <div
          className={onClose ? "p-4 border-b" : "p-4 border-b border-white/10"}
        >
          <Button
            onClick={() => {
              handleNewChat();
              onClose?.();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-glow-blue"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Conversations List */}
        <ConversationsList
          onSelectConversation={(id) => {
            loadConversation(id);
            onClose?.();
          }}
        />

        {/* Bottom Section */}
        <div
          className={
            onClose ? "border-t mt-auto" : "border-t border-white/10 mt-auto"
          }
        >
          {/* Clear All Button */}
          {conversations.length > 0 && (
            <div
              className={
                onClose ? "p-3 border-b" : "p-3 border-b border-white/10"
              }
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => {
                  setClearDialogOpen(true);
                  onClose?.();
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear All Conversations
              </Button>
            </div>
          )}

          {/* User Profile */}
          <UserProfileSection />
        </div>
      </div>
    </>
  );

  // Desktop sidebar
  if (!isMobile && sidebarOpen) {
    return (
      <div className="hidden md:flex md:w-64 lg:w-80 flex-col m-4 mr-0 gap-3">
        <SidebarContent />
      </div>
    );
  }

  // Mobile sidebar
  if (isMobile) {
    return (
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-80 p-0 flex flex-col [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Chat Sidebar</SheetTitle>
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return null;
}
