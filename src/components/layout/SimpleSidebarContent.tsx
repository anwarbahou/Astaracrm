import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/data/navigationData";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from '@/components/ui/sidebar/SidebarContext';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function SimpleSidebarContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const { userProfile } = useAuth();
  
  // Try to use sidebar context, but provide fallback if not available
  let sidebarContext;
  try {
    sidebarContext = useSidebar();
  } catch (error) {
    // If sidebar context is not available, use fallback values
    sidebarContext = {
      open: true, // Default to open for mobile sidebar
      state: "expanded",
      setOpenMobile: () => {}
    };
  }

  const { open: isSidebarOpen, setOpenMobile } = sidebarContext;

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return userProfile?.role && item.roles.includes(userProfile.role as any);
  });

  return (
    <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header with Close Button for Mobile */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/Logos/SKULTIX.svg" alt="Logo" className="h-8" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(false)}
          className="xl:hidden h-8 w-8 rounded-full hover:bg-muted/50"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="p-2 space-y-1">
          {filteredNavigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative">
                <Link
                  to={item.path}
                  onClick={() => setOpenMobile(false)} // Close mobile sidebar on navigation
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative group text-sm w-full",
                    isActive 
                      ? "bg-blue-600 text-white font-medium shadow-sm" 
                      : "text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
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
                    <Icon size={20} />
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "font-medium truncate min-w-0 flex-1",
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

        {/* User Info Section - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {userProfile?.first_name?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim() : userProfile?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userProfile?.role ? t(`app.roles.${userProfile.role}`) : 'User'}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 