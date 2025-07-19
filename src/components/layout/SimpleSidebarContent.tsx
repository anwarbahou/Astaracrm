import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/data/navigationData";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from '@/components/ui/sidebar/SidebarContext';

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
      state: "expanded"
    };
  }

  const { open: isSidebarOpen } = sidebarContext;

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return userProfile?.role && item.roles.includes(userProfile.role as any);
  });

  return (
    <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {isSidebarOpen ? (
            <img src="/Logos/SKULTIX.svg" alt="Logo" className="h-8" />
          ) : (
            <img src="/Logos/ICON.svg" alt="Logo" className="h-8" />
          )}
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
} 