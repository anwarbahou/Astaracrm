
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/data/navigationData";
import { containerVariants, itemVariants } from "@/lib/animations";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      layout
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border shadow-lg flex flex-col z-40",
        "transition-all duration-500 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header with toggle */}
      <div className="relative p-4 border-b border-border">
        <motion.button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 z-50 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-200 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isCollapsed ? (
              <ChevronRight size={14} className="text-muted-foreground" />
            ) : (
              <ChevronLeft size={14} className="text-muted-foreground" />
            )}
          </motion.div>
        </motion.button>

        <motion.div 
          className="flex items-center gap-3"
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
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
                <h1 className="text-lg font-semibold text-foreground">
                  WOLFHUNT
                </h1>
                <p className="text-xs text-muted-foreground">
                  CRM Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="flex-1 p-2 overflow-y-auto"
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
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group",
                    "hover:bg-muted/50",
                    isCollapsed ? "justify-center" : "",
                    isActive && "bg-muted text-foreground"
                  )}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 w-1 h-6 bg-primary rounded-r-full"
                      style={{ transform: "translateY(-50%)" }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "transition-colors duration-200",
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
                          "text-sm font-medium transition-colors duration-200",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-border shadow-md">
                      {item.label}
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
