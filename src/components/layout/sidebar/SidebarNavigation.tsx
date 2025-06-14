
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Users, User, Settings, Calendar, Mail, Search, List, Clock, DollarSign, Bot } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { itemVariants, buttonVariants, springConfig } from "@/lib/animations";

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

export function SidebarNavigation() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarContent className={cn(
      "transition-all duration-700 relative",
      isCollapsed ? "px-1 py-3" : "px-3 py-4"
    )}>
      <SidebarGroup>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-bold mb-6 px-4 tracking-widest uppercase flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Navigation
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
                transition={{ delay: index * 0.03 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={cn(
                      "group relative rounded-2xl transition-all duration-500 hover:shadow-lg overflow-hidden",
                      location.pathname === item.url && 
                      "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border border-primary/30 shadow-lg shadow-primary/20",
                      isCollapsed ? "justify-center mx-2 h-16 w-16" : "px-4 py-4 mx-1"
                    )}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-4 w-full relative z-10">
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className={cn(
                          "flex items-center justify-center transition-all duration-500 relative",
                          location.pathname === item.url && "text-primary",
                          isCollapsed ? "scale-110" : "scale-100"
                        )}
                      >
                        <item.icon 
                          size={isCollapsed ? 28 : 22} 
                          className={cn(
                            "transition-all duration-500",
                            location.pathname === item.url && "drop-shadow-sm"
                          )} 
                          strokeWidth={location.pathname === item.url ? 2.5 : 2}
                        />
                        
                        {/* Active indicator dot for collapsed state */}
                        {isCollapsed && location.pathname === item.url && (
                          <motion.div
                            layoutId="collapsedActiveIndicator"
                            className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full shadow-md"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={springConfig}
                          />
                        )}
                      </motion.div>
                      
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -20, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: "auto" }}
                            exit={{ opacity: 0, x: -20, width: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className={cn(
                              "font-semibold text-sm overflow-hidden whitespace-nowrap tracking-wide",
                              location.pathname === item.url && "text-primary font-bold"
                            )}
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Active indicator bar for expanded state */}
                      {!isCollapsed && location.pathname === item.url && (
                        <motion.div
                          layoutId="expandedActiveIndicator"
                          className="absolute left-0 top-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-lg"
                          initial={{ opacity: 0, scale: 0.5, x: -5 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={springConfig}
                        />
                      )}
                      
                      {/* Hover effect background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-sidebar-accent/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
