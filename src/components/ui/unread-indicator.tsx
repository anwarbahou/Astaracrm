import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UnreadIndicatorProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  showNumber?: boolean;
}

export function UnreadIndicator({ 
  count, 
  size = 'md', 
  variant = 'destructive',
  className,
  showNumber = true 
}: UnreadIndicatorProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'h-2 w-2 text-xs',
    md: 'h-3 w-3 text-xs',
    lg: 'h-4 w-4 text-sm'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <Badge 
      variant={variant}
      className={cn(
        'flex items-center justify-center rounded-full p-0 min-w-0',
        sizeClasses[size],
        className
      )}
    >
      {showNumber && displayCount}
    </Badge>
  );
}

export function UnreadDot({ 
  count, 
  className 
}: { 
  count: number; 
  className?: string; 
}) {
  if (count === 0) return null;

  return (
    <div className={cn(
      'h-2 w-2 rounded-full bg-red-500',
      className
    )} />
  );
} 