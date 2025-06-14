
import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to prevent flash
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize theme on first load to prevent flash
  useEffect(() => {
    const initializeTheme = () => {
      // Check localStorage first, then system preference
      const stored = localStorage.getItem('theme') as Theme;
      let initialTheme: Theme = 'dark'; // Default fallback

      if (stored && (stored === 'light' || stored === 'dark')) {
        initialTheme = stored;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initialTheme = 'dark';
      } else {
        initialTheme = 'light';
      }

      setTheme(initialTheme);
      
      // Apply theme class immediately to prevent flash
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(initialTheme);
      
      // Mark as loaded after a short delay to allow DOM to update
      setTimeout(() => setIsLoaded(true), 50);
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // Don't animate on initial load

    const root = document.documentElement;
    
    // Start transition
    setIsTransitioning(true);
    
    // Apply theme transition animation
    root.style.transition = 'background-color 500ms cubic-bezier(0.4, 0, 0.2, 1), color 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Store in localStorage
    localStorage.setItem('theme', theme);

    // End transition after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      root.style.transition = '';
    }, 500);

    return () => {
      clearTimeout(timer);
      root.style.transition = '';
    };
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    if (isTransitioning) return; // Prevent rapid toggling
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning, isLoaded }}>
      <motion.div
        className={`min-h-screen transition-theme duration-theme ease-theme ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <AnimatePresence mode="wait">
          {isLoaded && (
            <motion.div
              key="app-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="transition-theme duration-theme ease-theme"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
