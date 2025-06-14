
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isTransitioning}
      className="relative h-9 w-9 overflow-hidden hover:bg-muted/50 transition-all duration-300 rounded-xl"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
              }
            }}
            exit={{ 
              scale: 0, 
              rotate: 180, 
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
              }
            }}
            exit={{ 
              scale: 0, 
              rotate: -180, 
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading indicator */}
      {isTransitioning && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
        </motion.div>
      )}
    </Button>
  );
}
