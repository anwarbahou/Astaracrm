
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
import { Home, Users, User, Settings, Calendar, Mail, Search, List, Clock, DollarSign, FileText, Workflow, BarChart3 } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
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
    icon: FileText,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
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

  const isActiveRoute = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  return (
    <Sidebar className="border-r border-sidebar-border sidebar-transition">
      <SidebarHeader className={cn("p-4 transition-all duration-300", isCollapsed ? "px-2" : "px-6")}>
        <div className={cn("flex items-center gap-3 transition-all duration-300", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-sidebar-foreground animate-fade-in">
              WOLFHUNT
            </span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className={cn("px-2 transition-all duration-300", isCollapsed ? "px-1" : "px-3")}>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium mb-2 px-3 animate-fade-in">
              MAIN MENU
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActiveRoute(item.url)}
                    className={cn(
                      "crm-nav-item transition-all duration-200",
                      isActiveRoute(item.url) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      isCollapsed && "justify-center px-2"
                    )}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon size={18} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="animate-fade-in">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={cn("p-4 transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
        <div className={cn("text-xs text-sidebar-foreground/50 transition-all duration-300", isCollapsed && "text-center")}>
          {!isCollapsed ? "© 2024 WOLFHUNT CRM" : "© '24"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
