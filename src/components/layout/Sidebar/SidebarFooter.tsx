
import { motion, AnimatePresence } from "framer-motion";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  return (
    <motion.div 
      className="mt-auto p-4 border-t border-white/10"
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center space-y-2"
          >
            <motion.div
              className="text-xs text-white/60 font-bold tracking-wider uppercase"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              © 2024 WOLFHUNT
            </motion.div>
            <div className="text-xs text-white/40 font-medium">
              Professional CRM
            </div>
            
            {/* Decorative separator */}
            <motion.div 
              className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-3"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              className="w-2 h-2 bg-cyan-400/60 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.6, 1, 0.6] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="text-xs text-white/40 font-bold">
              '24
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
