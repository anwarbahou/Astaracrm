
import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'dark'; // Default to dark mode to maintain original design
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Start transition
    setIsTransitioning(true);
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Store in localStorage
    localStorage.setItem('theme', theme);

    // End transition after a short delay
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      <motion.div
        animate={{
          backgroundColor: theme === 'dark' 
            ? 'hsl(240 10% 3.9%)' 
            : 'hsl(0 0% 100%)'
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
        className="min-h-screen transition-colors duration-500"
      >
        {children}
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
