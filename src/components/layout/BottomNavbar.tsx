import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageSquare, DollarSign, CheckSquare, FileText, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMessagingUnread } from "@/hooks/useMessagingUnread";
import { Badge } from "@/components/ui/badge";

export function BottomNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { unreadCount: messagingUnreadCount } = useMessagingUnread();

  const navItems = [
    {
      id: "messaging",
      path: "/dashboard/messaging",
      icon: MessageSquare,
      label: t("app.sidebar.messaging"),
      labelKey: "messaging"
    },
    {
      id: "calendar",
      path: "/dashboard/calendar",
      icon: Calendar,
      label: t("app.sidebar.calendar"),
      labelKey: "calendar"
    },
    {
      id: "deals",
      path: "/dashboard/deals",
      icon: DollarSign,
      label: t("app.sidebar.deals"),
      labelKey: "deals"
    },
    {
      id: "tasks",
      path: "/dashboard/tasks",
      icon: CheckSquare,
      label: t("app.sidebar.tasks"),
      labelKey: "tasks"
    },
    {
      id: "notes",
      path: "/dashboard/notes",
      icon: FileText,
      label: t("app.sidebar.notes"),
      labelKey: "notes"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 lg:hidden pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl transition-all duration-200 relative group",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <motion.div
                className="flex flex-col items-center relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <div className="relative">
                  <Icon 
                    size={20} 
                    className={cn(
                      "mb-1 transition-colors duration-200",
                      isActive 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-gray-600 dark:text-gray-400"
                    )} 
                  />
                  {item.id === 'messaging' && messagingUnreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {messagingUnreadCount > 99 ? '99+' : messagingUnreadCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 