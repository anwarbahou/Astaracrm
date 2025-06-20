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
  threshold = 0.2,
  rootMargin = '50px',
  fallbackHeight = 'min-h-[400px]'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    
    if (entry.isIntersecting && !isLoaded) {
      // Load immediately when in view
      setIsLoaded(true);
      
      // Animate in after a brief delay
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      
      // Clean up observer
      if (observerRef.current && sectionRef.current) {
        observerRef.current.unobserve(sectionRef.current);
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    // Create a new intersection observer
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        root: null, // Use viewport as root
        rootMargin,
        threshold: [threshold]
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Render loading placeholder or content
  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className={`${fallbackHeight} flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse mx-auto mb-3"></div>
            <p className="text-white/50 text-sm">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`transition-all duration-700 ease-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className={className}>
      {renderContent()}
    </div>
  );
}; 