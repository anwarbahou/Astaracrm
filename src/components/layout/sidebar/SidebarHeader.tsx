
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarHeader as SidebarHeaderBase } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { springConfig } from "@/lib/animations";

export function SidebarHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeaderBase className={cn(
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
    </SidebarHeaderBase>
  );
}
