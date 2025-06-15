
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/data/navigationData";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const toggleSidebar = () => {
    onToggle(!isCollapsed);
  };

  return (
    <motion.aside
      layout
      className={cn(
        "fixed top-0 h-screen bg-card shadow-lg flex flex-col z-40",
        "transition-all duration-500 ease-in-out",
        isRtl ? "right-0 border-l border-border" : "left-0 border-r border-border",
        isCollapsed ? "w-16" : "w-64"
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header with toggle */}
      <div className="relative p-4 border-b border-border transition-theme duration-theme ease-theme">
        <motion.button
          onClick={toggleSidebar}
          className={cn(
            "absolute top-6 z-50 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-theme duration-theme ease-theme shadow-md",
            isRtl ? "-left-3" : "-right-3"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isCollapsed ? t('app.sidebar.expand') : t('app.sidebar.collapse')}
        >
          {isRtl ? (
            isCollapsed ? (
              <ChevronLeft size={14} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={14} className="text-muted-foreground" />
            )
          ) : isCollapsed ? (
            <ChevronRight size={14} className="text-muted-foreground" />
          ) : (
            <ChevronLeft size={14} className="text-muted-foreground" />
          )}
        </motion.button>

        <motion.div 
          className="flex items-center gap-3"
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-theme duration-theme ease-theme">
            <span className="text-primary-foreground font-bold text-sm transition-theme duration-theme ease-theme">W</span>
          </div>

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-semibold text-foreground transition-theme duration-theme ease-theme">
                  WOLFHUNT
                </h1>
                <p className="text-xs text-muted-foreground transition-theme duration-theme ease-theme">
                  CRM Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="flex-1 p-2 overflow-y-auto transition-theme duration-theme ease-theme"
        layout
      >
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                custom={index}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-theme duration-theme ease-theme relative group",
                    "hover:bg-muted/50",
                    isCollapsed ? "justify-center" : "",
                    isActive && "bg-muted text-foreground"
                  )}
                  title={isCollapsed ? t(`app.sidebar.${item.labelKey}`) : undefined}
                  aria-label={isCollapsed ? t(`app.sidebar.${item.labelKey}`) : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={cn(
                        "absolute top-1/2 w-1 h-6 bg-primary transition-theme duration-theme ease-theme",
                         isRtl ? "right-0 rounded-l-full" : "left-0 rounded-r-full"
                      )}
                      style={{ transform: "translateY(-50%)" }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "transition-theme duration-theme ease-theme",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    <Icon size={20} />
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-sm font-medium transition-theme duration-theme ease-theme",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {t(`app.sidebar.${item.labelKey}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-border shadow-md">
                      {t(`app.sidebar.${item.labelKey}`)}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>
    </motion.aside>
  );
}
