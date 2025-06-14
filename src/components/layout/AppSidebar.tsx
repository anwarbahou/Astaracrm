
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Users, User, Settings, Calendar, Mail, Search, List, Clock, DollarSign, Bot } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: User,
  },
  {
    title: "Deals",
    url: "/deals",
    icon: DollarSign,
  },
  {
    title: "AI Leads",
    url: "/ai-leads",
    icon: Bot,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: List,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Email Center",
    url: "/email",
    icon: Mail,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: Search,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Search,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Settings,
  },
  {
    title: "Activity Logs",
    url: "/activity-logs",
    icon: Clock,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border/20 transition-all duration-500 ease-in-out overflow-hidden">
      <SidebarHeader className={cn(
        "p-4 transition-all duration-500 ease-in-out",
        isCollapsed ? "px-2 py-4" : "px-6 py-4"
      )}>
        <div className={cn(
          "flex items-center gap-3 transition-all duration-500 ease-in-out",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <span className={cn(
            "font-bold text-xl text-sidebar-foreground transition-all duration-500 ease-in-out",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          )}>
            WOLFHUNT
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className={cn(
        "px-2 transition-all duration-500 ease-in-out",
        isCollapsed ? "px-1" : "px-3"
      )}>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-sidebar-foreground/70 text-xs font-medium mb-2 px-3 transition-all duration-500 ease-in-out",
            isCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100 h-auto mb-2"
          )}>
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={cn(
                      "crm-nav-item transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-sm",
                      location.pathname === item.url && "active bg-sidebar-accent/80 shadow-sm",
                      isCollapsed && "justify-center px-2 w-12 h-12 mx-auto"
                    )}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link to={item.url} className={cn(
                      "flex items-center gap-3 w-full transition-all duration-300 ease-in-out",
                      isCollapsed && "justify-center"
                    )}>
                      <item.icon size={20} className={cn(
                        "flex-shrink-0 transition-all duration-300 ease-in-out",
                        isCollapsed ? "text-sidebar-foreground" : "text-sidebar-foreground/80"
                      )} />
                      <span className={cn(
                        "transition-all duration-500 ease-in-out font-medium",
                        isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={cn(
        "p-4 transition-all duration-500 ease-in-out border-t border-sidebar-border/10",
        isCollapsed ? "px-2 py-4" : "px-4 py-4"
      )}>
        <div className={cn(
          "text-xs text-sidebar-foreground/50 transition-all duration-500 ease-in-out",
          isCollapsed ? "text-center opacity-70" : "opacity-100"
        )}>
          <span className={cn(
            "transition-all duration-500 ease-in-out",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          )}>
            © 2024 WOLFHUNT CRM
          </span>
          <span className={cn(
            "transition-all duration-500 ease-in-out",
            isCollapsed ? "opacity-100" : "opacity-0 absolute"
          )}>
            © '24
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
