
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "./NavigationMenu";

export function SidebarNavigation() {
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
          <NavigationMenu />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
