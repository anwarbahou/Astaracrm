
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sidebarMenuItems } from "@/data/sidebarData";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      layout
      className={cn(
        "h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-white/10 shadow-2xl flex flex-col relative z-40",
        "transition-all duration-500 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Header */}
      <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Navigation Menu */}
      <motion.nav 
        className={cn(
          "flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
          isCollapsed ? "px-2" : "px-1"
        )}
        layout
      >
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="px-3 mb-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white/50 tracking-widest uppercase">
                <motion.div 
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Navigation
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          {sidebarMenuItems.map((item, index) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              index={index}
            />
          ))}
        </div>

        {/* Decorative separator */}
        <motion.div 
          className="mx-4 my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </motion.nav>

      {/* Footer */}
      <SidebarFooter isCollapsed={isCollapsed} />

      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 20%, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
    </motion.aside>
  );
}
