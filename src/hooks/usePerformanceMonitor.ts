import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  loadTime?: number;
  renderTime?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTimeRef.current;

    // Only log in development
    if (import.meta.env.DEV) {
      console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }

    // Report to analytics or monitoring service in production
    if (import.meta.env.PROD && loadTime > 1000) {
      // Report slow loading components
      console.warn(`Slow loading component: ${componentName} (${loadTime.toFixed(2)}ms)`);
    }
  }, [componentName]);

  return {
    markLoadComplete: () => {
      const endTime = performance.now();
      const totalTime = endTime - startTimeRef.current;
      
      if (import.meta.env.DEV) {
        console.log(`${componentName} completed in ${totalTime.toFixed(2)}ms`);
      }
      
      return totalTime;
    }
  };
}; 