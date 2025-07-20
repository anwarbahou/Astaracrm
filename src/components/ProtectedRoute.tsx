import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// WebGL Error Boundary Component
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if the error is WebGL-related
    if (
      error?.message?.includes('WebGL') ||
      error?.message?.includes('context') ||
      error?.message?.includes('THREE.WebGLRenderer') ||
      error?.message?.includes('WebGL context could not be created')
    ) {
      console.warn('WebGL error caught by boundary:', error);
      return { hasError: true };
    }
    // Re-throw non-WebGL errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by WebGL boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return a fallback UI that doesn't use WebGL
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-32 h-32 mx-auto mb-6">
              {/* SVG Fallback Icon */}
              <svg
                viewBox="0 0 167 125"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
              >
                <defs>
                  <linearGradient id="fallbackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f0f0f0', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path
                  d="M142.385 64C105.462 113.2 68.5385 113.2 31.6154 64L19.3077 51.7C64.4359 2.5 107.513 2.5 148.538 51.7L167 76.3L167 51.7C113.667 -13.9 60.3333 -13.9 7 51.7L25.4615 76.3C66.4872 125.5 109.564 125.5 154.692 76.3L142.385 64Z"
                  fill="url(#fallbackGradient)"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Graphics Compatibility Notice</h2>
            <p className="text-muted-foreground mb-6">
              Your browser or device doesn't support advanced 3D graphics. 
              The application will continue to work normally with enhanced 2D graphics.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <WebGLErrorBoundary>
      {children}
    </WebGLErrorBoundary>
  );
}; 