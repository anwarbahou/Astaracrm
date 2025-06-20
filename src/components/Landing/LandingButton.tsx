import React from 'react';

interface LandingButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const LandingButton: React.FC<LandingButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}) => {
  const baseClasses = "px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed";

  if (variant === 'secondary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} bg-transparent border border-white/30 text-white/90 hover:border-white/60 hover:text-white hover:bg-white/5 ${className}`}
        aria-label={typeof children === 'string' ? children : undefined}
      >
        {children}
      </button>
    );
  }

  // Primary variant with enhanced glass effect
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} relative bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 hover:shadow-2xl shadow-lg ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-50" />
      <div className="absolute inset-0 rounded-full shadow-inner" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}; 