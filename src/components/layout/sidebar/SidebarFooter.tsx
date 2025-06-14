
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarFooter as SidebarFooterBase } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { springConfig } from "@/lib/animations";

export function SidebarFooter() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarFooterBase className={cn(
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
    </SidebarFooterBase>
  );
}
