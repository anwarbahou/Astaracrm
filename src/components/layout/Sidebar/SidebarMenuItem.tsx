
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  item: {
    id: string;
    label: string;
    icon: LucideIcon;
    route: string;
    color: string;
  };
  isCollapsed: boolean;
  index: number;
}

export function SidebarMenuItem({ item, isCollapsed, index }: SidebarMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.route;
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut" 
      }}
      className="relative group"
    >
      <Link
        to={item.route}
        className={cn(
          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-out relative overflow-hidden",
          "hover:bg-white/5 hover:shadow-lg hover:scale-[1.02]",
          isCollapsed ? "justify-center w-12 h-12 mx-auto" : "mx-2",
          isActive && "bg-gradient-to-r from-white/10 to-white/5 shadow-lg border border-white/10"
        )}
        title={isCollapsed ? item.label : undefined}
        aria-label={isCollapsed ? item.label : undefined}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.05 }}
        />
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transform: "translateY(-50%)" }}
          />
        )}

        {/* Icon */}
        <motion.div
          className={cn(
            "relative z-10 transition-all duration-300",
            isActive ? "text-cyan-400" : "text-white/80",
            item.color,
            "group-hover:scale-110 group-hover:drop-shadow-lg"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon 
            size={isCollapsed ? 24 : 20} 
            strokeWidth={isActive ? 2.5 : 2}
          />
        </motion.div>

        {/* Label */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "font-medium text-sm tracking-wide relative z-10 whitespace-nowrap overflow-hidden",
                isActive ? "text-white font-semibold" : "text-white/80"
              )}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
            {item.label}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
