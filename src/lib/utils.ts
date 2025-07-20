import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WebGL Utility Functions
export const WebGLUtils = {
  // Check if WebGL is available
  isWebGLAvailable: (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  },

  // Check WebGL context status
  getWebGLContextStatus: (): 'available' | 'unavailable' | 'context-lost' => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return 'unavailable';
      }

      // Check if context is lost (only available on WebGL contexts)
      if ('isContextLost' in gl && typeof gl.isContextLost === 'function' && gl.isContextLost()) {
        return 'context-lost';
      }

      return 'available';
    } catch (e) {
      return 'unavailable';
    }
  },

  // Get WebGL context with error handling
  getWebGLContext: (canvas: HTMLCanvasElement, options?: WebGLContextAttributes): WebGLRenderingContext | null => {
    try {
      const gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
      
      if (gl && 'isContextLost' in gl) {
        // Set up context loss handling
        canvas.addEventListener('webglcontextlost', (event) => {
          console.warn('WebGL context lost');
          event.preventDefault();
        }, false);

        canvas.addEventListener('webglcontextrestored', () => {
          console.log('WebGL context restored');
        }, false);
      }

      return gl as WebGLRenderingContext | null;
    } catch (e) {
      console.warn('Failed to get WebGL context:', e);
      return null;
    }
  },

  // Create a fallback canvas for when WebGL is not available
  createFallbackCanvas: (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw a simple fallback graphic
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('2D Fallback', width / 2, height / 2);
    }
    
    return canvas;
  },

  // Debounced WebGL context check
  debouncedWebGLCheck: (() => {
    let timeoutId: NodeJS.Timeout;
    return (callback: (available: boolean) => void, delay: number = 100) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(WebGLUtils.isWebGLAvailable());
      }, delay);
    };
  })(),

  // Retry WebGL context creation with exponential backoff
  retryWebGLContext: async (
    canvas: HTMLCanvasElement, 
    options?: WebGLContextAttributes,
    maxRetries: number = 3
  ): Promise<WebGLRenderingContext | null> => {
    for (let i = 0; i < maxRetries; i++) {
      const gl = WebGLUtils.getWebGLContext(canvas, options);
      if (gl) {
        return gl;
      }
      
      // Wait with exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 100));
      }
    }
    
    return null;
  }
};

// Performance monitoring for WebGL
export const WebGLPerformance = {
  contextLossCount: 0,
  lastContextLoss: 0,

  recordContextLoss: () => {
    WebGLPerformance.contextLossCount++;
    WebGLPerformance.lastContextLoss = Date.now();
    console.warn(`WebGL context lost (${WebGLPerformance.contextLossCount} times)`);
  },

  shouldDisableWebGL: (): boolean => {
    // Disable WebGL if we've had too many context losses recently
    const recentLosses = WebGLPerformance.contextLossCount;
    const timeSinceLastLoss = Date.now() - WebGLPerformance.lastContextLoss;
    
    return recentLosses > 5 && timeSinceLastLoss < 60000; // 5+ losses in last minute
  },

  reset: () => {
    WebGLPerformance.contextLossCount = 0;
    WebGLPerformance.lastContextLoss = 0;
  }
};
