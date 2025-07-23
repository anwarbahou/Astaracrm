import React, { useMemo, useState, useEffect } from "react";
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
import { useMessagingUnread } from "@/hooks/useMessagingUnread";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export const Sidebar = React.memo(function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { userProfile, loading: authLoading, error: authError } = useAuth();
  const { unreadCount: messagingUnreadCount } = useMessagingUnread();
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

  // Improved loading state with timeout
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  useEffect(() => {
    if (authLoading) {
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // Show timeout warning after 5 seconds
      
      return () => clearTimeout(timeoutId);
    } else {
      setLoadingTimeout(false);
    }
  }, [authLoading]);

  // Static sidebar content without animations
  const SidebarContent = () => (
    <div 
      className="h-full bg-[#232323] text-white"
    >
      {/* Header */}
      <div 
        className="p-4 border-b border-[#000000]"
      >
        <div className={isCollapsed ? "flex items-center justify-center" : "flex items-center justify-center w-full"}>
          <div 
            className={isCollapsed ? "w-8 h-8 flex items-center justify-center" : "w-40 h-12 flex items-center justify-center mx-auto"}
          >
            <img
              src={isCollapsed ? "/Logos/ICON.svg" : "/Logos/SKULTIX.svg"}
              alt="Logo"
              className={isCollapsed ? "w-8 h-8 object-contain" : "w-40 h-12 object-contain"}
            />
          </div>
        </div>
      </div>
      {/* Loading/Error State */}
      {(authLoading || authError) ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          {authLoading && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-gray-300 text-sm">
                {loadingTimeout ? "Loading taking longer than usual..." : "Loading user..."}
              </span>
              {loadingTimeout && (
                <button 
                  onClick={() => window.location.reload()}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Refresh page
                </button>
              )}
            </div>
          )}
          {authError && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-red-400 text-sm">{authError}</span>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      ) : (
        <nav 
          className="flex-1 p-2 overflow-y-auto bg-[#232323] scrollbar-thin"
        >
          <div className="space-y-1">
            {filteredNavigationItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <div 
                  key={item.id} 
                  className="relative"
                >
                  <Link
                    to={authLoading || authError || item.soon ? '#' : item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group text-sm w-full",
                      isActive 
                        ? "bg-gray-800 text-white font-medium" 
                        : "text-white hover:text-white hover:bg-gray-800",
                      (authLoading || authError || item.soon) && "pointer-events-none opacity-60"
                    )}
                    title={isCollapsed ? t(`app.sidebar.${item.labelKey}`) : undefined}
                    tabIndex={authLoading || authError || item.soon ? -1 : 0}
                    aria-disabled={!!(authLoading || authError || item.soon)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute top-1/2 w-1 h-6 bg-white rounded-full left-0",
                          "transform -translate-y-1/2"
                        )}
                      />
                    )}
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-white" : "text-white"
                    )}>
                      <Icon size={18} />
                    </div>
                    {/* Label */}
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "font-medium truncate min-w-0 flex items-center gap-2",
                          isActive ? "text-white" : "text-white"
                        )}
                      >
                        {t(`app.sidebar.${item.labelKey}`)}
                        {item.soon && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#000000] text-white rounded">
                            {t('app.sidebar.soon')}
                          </span>
                        )}
                        {item.id === 'messaging' && messagingUnreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {messagingUnreadCount > 99 ? '99+' : messagingUnreadCount}
                          </Badge>
                        )}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed top-0 h-screen bg-[#232323] shadow-lg flex-col z-50 hidden xl:flex border-r border-[#000000]",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <SidebarContent />
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
    </aside>
  );
});
