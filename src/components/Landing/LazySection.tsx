import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallbackHeight?: string;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  fallbackHeight = 'min-h-[50vh]'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !hasLoaded) {
      setHasLoaded(true);
      // Use RAF for smooth animation timing
      requestAnimationFrame(() => {
        setTimeout(() => setIsVisible(true), 50);
      });
      
      // Disconnect observer after loading to save resources
      if (observerRef.current && sectionRef.current) {
        observerRef.current.unobserve(sectionRef.current);
      }
    }
  }, [hasLoaded]);

  useEffect(() => {
    const currentRef = sectionRef.current;
    
    if (!currentRef) return;

    // Create observer with better options for performance
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      // Add passive option for better performance
    });

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, handleIntersection]);

  return (
    <div
      ref={sectionRef}
      className={`${fallbackHeight} transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {hasLoaded ? children : (
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-white/20 rounded-full animate-bounce mx-auto mb-4"></div>
            <p className="text-white/60 text-sm">Loading section...</p>
          </div>
        </div>
      )}
    </div>
  );
}; 