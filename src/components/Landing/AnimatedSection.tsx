import React from 'react';
import { useScrollAnimation, getAnimationClasses, AnimationVariant } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variant = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  className = '',
  triggerOnce = true
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin: '50px',
    triggerOnce,
    delay
  });

  const animationClasses = getAnimationClasses(variant, isVisible);

  return (
    <div
      ref={ref}
      className={`${animationClasses} ${className}`}
    >
      {children}
    </div>
  );
};

// Specialized components for common use cases
export const FadeInSection: React.FC<Omit<AnimatedSectionProps, 'variant'>> = (props) => (
  <AnimatedSection {...props} variant="fadeIn" />
);

export const SlideUpSection: React.FC<Omit<AnimatedSectionProps, 'variant'>> = (props) => (
  <AnimatedSection {...props} variant="slideUp" />
);

export const ScaleInSection: React.FC<Omit<AnimatedSectionProps, 'variant'>> = (props) => (
  <AnimatedSection {...props} variant="scaleIn" />
); 