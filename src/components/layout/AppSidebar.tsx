
"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import { 
  sidebarVariants, 
  sidebarContentVariants,
  itemVariants,
  buttonVariants,
  springConfig
} from "@/lib/animations";

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
    <Sidebar 
      collapsible="icon"
      className="border-r border-sidebar-border/10 backdrop-blur-sm bg-sidebar/95 shadow-lg transition-all duration-500 ease-in-out"
    >
      {/* Header with Logo */}
      <SidebarHeader className={cn(
        "border-b border-sidebar-border/10 transition-all duration-500",
        isCollapsed ? "p-3" : "p-6"
      )}>
        <motion.div 
          className="flex items-center gap-3"
          layout
          transition={springConfig}
        >
          <motion.div 
            className={cn(
              "bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500",
              isCollapsed ? "w-12 h-12" : "w-10 h-10"
            )}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={springConfig}
          >
            <span className={cn(
              "text-primary-foreground font-bold transition-all duration-300",
              isCollapsed ? "text-xl" : "text-lg"
            )}>W</span>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.h1 
                  className="font-bold text-xl text-sidebar-foreground bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text"
                  layout
                >
                  WOLFHUNT
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </SidebarHeader>
      
      {/* Main Content */}
      <SidebarContent className={cn(
        "transition-all duration-500",
        isCollapsed ? "px-2 py-2" : "px-4 py-2"
      )}>
        <SidebarGroup>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold mb-4 px-3 tracking-wider uppercase">
                  Main Menu
                </SidebarGroupLabel>
              </motion.div>
            )}
          </AnimatePresence>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.05 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className={cn(
                        "group relative rounded-xl transition-all duration-300 hover:shadow-md",
                        location.pathname === item.url && 
                        "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm",
                        isCollapsed ? "justify-center p-4 mx-1 h-14" : "px-4 py-3"
                      )}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className={cn(
                            "flex items-center justify-center transition-all duration-300",
                            location.pathname === item.url && "text-primary",
                            isCollapsed && "scale-110"
                          )}
                        >
                          <item.icon 
                            size={isCollapsed ? 24 : 20} 
                            className="transition-all duration-300" 
                          />
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -10, width: 0 }}
                              animate={{ opacity: 1, x: 0, width: "auto" }}
                              exit={{ opacity: 0, x: -10, width: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className={cn(
                                "font-medium text-sm overflow-hidden whitespace-nowrap",
                                location.pathname === item.url && "text-primary font-semibold"
                              )}
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        
                        {/* Active indicator */}
                        {location.pathname === item.url && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 w-1 h-6 bg-primary rounded-r-full"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={springConfig}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer */}
      <SidebarFooter className={cn(
        "border-t border-sidebar-border/10 mt-auto transition-all duration-500",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <motion.div 
          className="text-center"
          layout
          transition={springConfig}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-sidebar-foreground/40 font-medium"
              >
                © 2024 WOLFHUNT CRM
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-sidebar-foreground/40 font-medium"
              >
                © '24
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
