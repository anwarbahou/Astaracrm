import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, error, forceRefresh } = useAuth();
  const location = useLocation();

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => forceRefresh()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 w-full"
            >
              Retry Connection
            </button>
          <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 w-full"
          >
              Reload Page
          </button>
          </div>
        </div>
      </div>
    );
  }

  // Save the attempted URL for redirecting after login
  const currentPath = location.pathname + location.search + location.hash;
  sessionStorage.setItem('redirectAfterLogin', currentPath);
  return <Navigate to="/login" replace />;
}; 