import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/data/navigationData";
import { containerVariants, itemVariants, sidebarVariants, sidebarContentVariants } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { SimpleSidebarContent } from "./SimpleSidebarContent";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export const Sidebar = React.memo(function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { userProfile, loading: authLoading, error: authError } = useAuth();
  const isRtl = i18n.dir() === 'rtl';

  const filteredNavigationItems = useMemo(() => navigationItems.filter(item => {
    if (!item.roles) return true;
    const role = userProfile?.role;
    if (role === 'user' || role === 'admin' || role === 'manager') {
      return item.roles.includes(role);
    }
    return false;
  }), [userProfile]);

  const toggleSidebar = () => {
    onToggle(!isCollapsed);
  };

  // Animated sidebar content with framer-motion
  const AnimatedSidebarContent = () => (
    <motion.div 
      className="h-full bg-gray-900 text-white"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      layout // Enable layout animations
    >
      {/* Header */}
      <motion.div 
        className="p-4 border-b border-gray-800"
        layout // Enable layout animation for header
      >
        <div className={isCollapsed ? "flex items-center justify-center" : "flex items-center justify-center w-full"}>
          <motion.div 
            className={isCollapsed ? "w-8 h-8 flex items-center justify-center" : "w-40 h-12 flex items-center justify-center mx-auto"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <img
              src={isCollapsed ? "/Logos/ICON.svg" : "/Logos/SKULTIX.svg"}
              alt="Logo"
              className={isCollapsed ? "w-8 h-8 object-contain" : "w-40 h-12 object-contain"}
            />
          </motion.div>
        </div>
      </motion.div>
      {/* Loading/Error State */}
      {(authLoading || authError) ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          {authLoading && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-gray-300 text-sm">Loading user...</span>
            </div>
          )}
          {authError && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-red-400 text-sm">{authError}</span>
            </div>
          )}
        </div>
      ) : (
        <motion.nav 
          className="flex-1 p-2 overflow-y-auto bg-gray-900 scrollbar-thin"
          variants={containerVariants}
          animate="animate"
          layout // Enable layout animation for nav
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
                  whileHover={authLoading || authError ? undefined : { scale: 1.02 }}
                  whileTap={authLoading || authError ? undefined : { scale: 0.98 }}
                  layout // Enable layout animation for nav items
                >
                  <Link
                    to={authLoading || authError ? '#' : item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group text-sm w-full",
                      isActive 
                        ? "bg-gray-800 text-white font-medium" 
                        : "text-white hover:text-white hover:bg-gray-800",
                      (authLoading || authError) && "pointer-events-none opacity-60"
                    )}
                    title={isCollapsed ? t(`app.sidebar.${item.labelKey}`) : undefined}
                    tabIndex={authLoading || authError ? -1 : 0}
                    aria-disabled={!!(authLoading || authError)}
                  >
                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={cn(
                            "absolute top-1/2 w-1 h-6 bg-white rounded-full left-0",
                            "transform -translate-y-1/2"
                          )}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ duration: 0.2 }}
                          layout // Enable layout animation for active indicator
                        />
                      )}
                    </AnimatePresence>
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-white" : "text-white"
                    )}>
                      <Icon size={18} />
                    </div>
                    {/* Label */}
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          className={cn(
                            "font-medium truncate min-w-0 flex items-center gap-2",
                            isActive ? "text-white" : "text-white"
                          )}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          layout // Enable layout animation for label
                        >
                          {t(`app.sidebar.${item.labelKey}`)}
                          {item.id === 'ai-leads' && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-700 text-white rounded">
                              {t('app.sidebar.soon')}
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {/* Debug info */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                className="mt-4 p-2 text-xs text-gray-400 border-t border-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                layout // Enable layout animation for debug info
              >
                <div>Theme: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</div>
                <div>Items: {filteredNavigationItems.length}</div>
                <div>User: {userProfile && (userProfile.role === 'user' || userProfile.role === 'admin' || userProfile.role === 'manager') ? userProfile.role : 'none'}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </motion.div>
  );

  return (
    <motion.aside
      className={cn(
        "fixed top-0 h-screen bg-white dark:bg-gray-900 shadow-lg flex-col z-50 hidden xl:flex border-r border-gray-200 dark:border-gray-700",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layout // Enable layout animation for aside
    >
      <AnimatedSidebarContent />
      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-white dark:bg-gray-800 shadow-md",
          isRtl ? "right-auto -left-3" : "-right-3"
        )}
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight size={12} className={isRtl ? "rotate-180" : ""} />
        ) : (
          <ChevronLeft size={12} className={isRtl ? "rotate-180" : ""} />
        )}
      </Button>
    </motion.aside>
  );
});
