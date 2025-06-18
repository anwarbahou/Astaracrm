import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/data/navigationData";
import { containerVariants, itemVariants, sidebarVariants, sidebarContentVariants } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { userProfile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isRtl = i18n.dir() === 'rtl';

  const toggleSidebar = () => {
    onToggle(!isCollapsed);
  };

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return userProfile?.role && item.roles.includes(userProfile.role);
  });

  // Animated sidebar content with framer-motion
  const AnimatedSidebarContent = () => (
    <motion.div 
      className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
    >
      {/* Header */}
      <motion.div 
        className="p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          {/* Logo icon - always visible */}
          <motion.div 
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-sm">W</span>
          </motion.div>
          
          {/* Logo text - only visible when expanded */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  WOLFHUNT
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  CRM Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        className="flex-1 p-2 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-thin"
        variants={containerVariants}
        animate="animate"
      >
        <div className="space-y-1">
          {filteredNavigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.div 
                key={item.id} 
                className="relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group text-sm w-full",
                    isActive 
                      ? "bg-blue-600 text-white font-medium" 
                      : "text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? t(`app.sidebar.${item.labelKey}`) : undefined}
                >
                  {/* Active indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className={cn(
                          "absolute top-1/2 w-1 h-6 bg-blue-600 rounded-full left-0",
                          "transform -translate-y-1/2"
                        )}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div 
                    className={cn(
                      "flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
                    )}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? [0, -10, 10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={18} />
                  </motion.div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        className={cn(
                          "font-medium truncate min-w-0",
                          isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {t(`app.sidebar.${item.labelKey}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Debug info - only show when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              className="mt-4 p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div>Theme: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</div>
              <div>Items: {filteredNavigationItems.length}</div>
              <div>User: {userProfile?.role || 'none'}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.div>
  );

  // Simple sidebar content for mobile (no collapse functionality)
  const SimpleSidebarContent = () => (
    <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              WOLFHUNT
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              CRM Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-thin">
        <div className="space-y-1">
          {filteredNavigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group text-sm w-full",
                    isActive 
                      ? "bg-blue-600 text-white font-medium" 
                      : "text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className={cn(
                        "absolute top-1/2 w-1 h-6 bg-blue-600 rounded-full left-0",
                        "transform -translate-y-1/2"
                      )}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
                  )}>
                    <Icon size={18} />
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "font-medium truncate min-w-0",
                      isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
                    )}
                  >
                    {t(`app.sidebar.${item.labelKey}`)}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Debug info */}
        <div className="mt-4 p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <div>Theme: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</div>
          <div>Items: {filteredNavigationItems.length}</div>
          <div>User: {userProfile?.role || 'none'}</div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg text-gray-900 dark:text-gray-100"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <div className="h-full flex flex-col">
            <SimpleSidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 h-screen bg-white dark:bg-gray-900 shadow-lg flex-col z-50 hidden md:flex border-r border-gray-200 dark:border-gray-700"
        )}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
      >
        <AnimatedSidebarContent />
        
        {/* Toggle Button - positioned on the right edge */}
        <motion.button
          onClick={toggleSidebar}
          className={cn(
            "absolute top-4 -right-3 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
            "rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700",
            "transition-colors duration-200 z-10"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={12} className="text-gray-600 dark:text-gray-400" />
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
}
