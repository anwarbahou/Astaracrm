
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="relative p-4 border-b border-white/10">
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-50 w-6 h-6 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-full flex items-center justify-center hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-white/80" />
          ) : (
            <ChevronLeft size={14} className="text-white/80" />
          )}
        </motion.div>
      </motion.button>

      {/* Logo and Brand */}
      <motion.div 
        className="flex items-center gap-3"
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
          whileHover={{ 
            scale: 1.05,
            rotate: [0, -5, 5, 0],
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-white font-black text-lg tracking-tight">W</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.h1 
                className="text-xl font-black text-white tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text"
                layoutId="brand-text"
              >
                WOLFHUNT
              </motion.h1>
              <motion.p 
                className="text-xs text-white/60 font-medium tracking-wider uppercase"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                CRM Platform
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
