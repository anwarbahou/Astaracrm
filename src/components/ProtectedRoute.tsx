import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, error, retry } = useAuth();
  const location = useLocation();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute:', { loading, error, user });
  }, [loading, error, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setTimedOut(true), 10000);
    return () => clearTimeout(timeoutId);
  }, []);

  // If user is set, always render children
  if (user) {
    return <>{children}</>;
  }

  if ((loading && !timedOut) && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verifying your session...</p>
          <p className="mt-1 text-sm text-muted-foreground/70">This should only take a moment</p>
        </div>
      </div>
    );
  }

  if ((error || timedOut) && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Loading took too long. Please check your connection or try again."}
          </p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Save the attempted URL for redirecting after login
  const currentPath = location.pathname + location.search + location.hash;
  sessionStorage.setItem('redirectAfterLogin', currentPath);
  return <Navigate to="/login" replace />;
}; 