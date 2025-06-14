
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants, springConfig } from "@/lib/animations";
import type { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  item: {
    title: string;
    url: string;
    icon: LucideIcon;
  };
  index: number;
}

export function NavigationItem({ item, index }: NavigationItemProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className={cn(
          "group relative rounded-2xl transition-all duration-500 hover:shadow-lg overflow-hidden",
          isActive && 
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
              isActive && "text-primary",
              isCollapsed ? "scale-110" : "scale-100"
            )}
          >
            <item.icon 
              size={isCollapsed ? 28 : 22} 
              className={cn(
                "transition-all duration-500",
                isActive && "drop-shadow-sm"
              )} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            
            {/* Active indicator dot for collapsed state */}
            {isCollapsed && isActive && (
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
                  isActive && "text-primary font-bold"
                )}
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Active indicator bar for expanded state */}
          {!isCollapsed && isActive && (
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
  );
}
