
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button" | "table" | "sidebar";
  lines?: number;
  animate?: boolean;
}

export function SkeletonLoader({ 
  className, 
  variant = "text", 
  lines = 1,
  animate = true 
}: SkeletonLoaderProps) {
  const baseClasses = "bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md";
  const animationClasses = animate ? "animate-pulse" : "";

  const variants = {
    text: "h-4 w-full",
    card: "h-40 w-full",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
    table: "h-6 w-full",
    sidebar: "h-8 w-full"
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={cn(
              baseClasses,
              variants[variant],
              animationClasses,
              index === lines - 1 && "w-3/4", // Make last line shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        baseClasses,
        variants[variant],
        animationClasses,
        className
      )}
    />
  );
}

// Specialized skeleton components
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 border rounded-lg space-y-4", className)}>
      <SkeletonLoader variant="text" className="h-6 w-1/3" />
      <SkeletonLoader variant="text" lines={3} />
      <div className="flex space-x-2">
        <SkeletonLoader variant="button" />
        <SkeletonLoader variant="button" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonLoader key={`header-${index}`} variant="table" className="h-4" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.div
          key={`row-${rowIndex}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: rowIndex * 0.1, duration: 0.3 }}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader key={`cell-${rowIndex}-${colIndex}`} variant="table" />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-center space-x-3 p-2"
        >
          <SkeletonLoader variant="avatar" className="h-6 w-6" />
          <SkeletonLoader variant="text" className="flex-1 h-4" />
        </motion.div>
      ))}
    </div>
  );
}
