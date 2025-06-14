
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Loader2 } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isTransitioning}
      className="relative h-9 w-9 overflow-hidden hover:bg-muted/50 transition-all duration-300 rounded-xl group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-4 h-4">
        <AnimatePresence mode="wait" initial={false}>
          {isTransitioning ? (
            <motion.div
              key="loading"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 360,
                transition: {
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.5, repeat: Infinity, ease: "linear" }
                }
              }}
              exit={{ scale: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          ) : theme === 'light' ? (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.4
                }
              }}
              exit={{ 
                scale: 0, 
                rotate: 90, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-4 w-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: 90, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.4
                }
              }}
              exit={{ 
                scale: 0, 
                rotate: -90, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: theme === 'light' 
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
        }}
      />
    </Button>
  );
}
