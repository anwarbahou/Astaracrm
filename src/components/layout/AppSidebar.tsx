
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
      className="border-r border-sidebar-border/20 bg-gradient-to-b from-sidebar/98 to-sidebar/95 backdrop-blur-md shadow-xl transition-all duration-700 ease-in-out"
    >
      {/* Header with Logo */}
      <SidebarHeader className={cn(
        "border-b border-sidebar-border/20 transition-all duration-700 relative overflow-hidden",
        isCollapsed ? "px-2 py-4" : "px-6 py-6"
      )}>
        <motion.div 
          className="flex items-center gap-4 relative z-10"
          layout
          transition={springConfig}
        >
          <motion.div 
            className={cn(
              "bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-primary/10 transition-all duration-700",
              isCollapsed ? "w-14 h-14" : "w-12 h-12"
            )}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, 0],
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.9 }}
            transition={springConfig}
          >
            <motion.span 
              className={cn(
                "text-primary-foreground font-black tracking-tight transition-all duration-500",
                isCollapsed ? "text-2xl" : "text-xl"
              )}
              animate={{ 
                textShadow: isCollapsed ? "0 2px 4px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.2)"
              }}
            >
              W
            </motion.span>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -30, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -30, width: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.h1 
                  className="font-black text-2xl bg-gradient-to-r from-sidebar-foreground via-sidebar-foreground/90 to-sidebar-foreground/70 bg-clip-text text-transparent tracking-tight"
                  layoutId="logo-text"
                >
                  WOLFHUNT
                </motion.h1>
                <motion.p 
                  className="text-xs text-sidebar-foreground/60 font-medium tracking-wider uppercase mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  CRM Platform
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Decorative background pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 20% 20%, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
      </SidebarHeader>
      
      {/* Main Content */}
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
      
      {/* Footer */}
      <SidebarFooter className={cn(
        "border-t border-sidebar-border/20 mt-auto transition-all duration-700 relative overflow-hidden",
        isCollapsed ? "p-2" : "p-6"
      )}>
        <motion.div 
          className="text-center relative z-10"
          layout
          transition={springConfig}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <motion.div
                  className="text-xs text-sidebar-foreground/60 font-bold tracking-wider uppercase"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  © 2024 WOLFHUNT
                </motion.div>
                <div className="text-xs text-sidebar-foreground/40 font-medium">
                  Professional CRM
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  className="w-2 h-2 bg-primary/60 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="text-xs text-sidebar-foreground/40 font-bold">
                  '24
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Decorative footer gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-60"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
