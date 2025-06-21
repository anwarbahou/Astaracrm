import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasTriggered(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return { ref: elementRef, isVisible, hasTriggered };
};

// Animation variant types
export type AnimationVariant = 
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'flipIn'
  | 'rotateIn';

export const getAnimationClasses = (variant: AnimationVariant, isVisible: boolean) => {
  const baseClasses = 'transition-all duration-700 ease-out';
  
  const variants = {
    fadeIn: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-4',
    
    slideUp: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8',
    
    slideDown: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 -translate-y-8',
    
    slideLeft: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-8',
    
    slideRight: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-8',
    
    scaleIn: isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
    
    flipIn: isVisible 
      ? 'opacity-100 scale-100 rotate-0' 
      : 'opacity-0 scale-95 rotate-12',
    
    rotateIn: isVisible 
      ? 'opacity-100 rotate-0' 
      : 'opacity-0 rotate-45'
  };

  return `${baseClasses} ${variants[variant]}`;
}; 