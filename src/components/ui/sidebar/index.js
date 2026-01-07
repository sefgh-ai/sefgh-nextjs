// Re-export all sidebar components from a single index file
// This maintains backward compatibility with existing imports

export {
  SidebarContext,
  SidebarProvider,
  useSidebar,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "./sidebar-context";

export {
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "./sidebar-core";

export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./sidebar-group";

export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar-menu";
