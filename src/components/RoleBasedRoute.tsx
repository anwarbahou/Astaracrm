import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = string;

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/dashboard'
}) => {
  const { userProfile, loading } = useAuth();

  // Show loading while checking authentication
  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user role is not in allowed roles, redirect to fallback
  if (!userProfile.role || !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

// Helper components for common role combinations
export const AdminOnlyRoute: React.FC<{ children: React.ReactNode; fallbackPath?: string }> = ({
  children,
  fallbackPath = '/dashboard'
}) => (
  <RoleBasedRoute allowedRoles={['admin']} fallbackPath={fallbackPath}>
    {children}
  </RoleBasedRoute>
);

export const AdminManagerRoute: React.FC<{ children: React.ReactNode; fallbackPath?: string }> = ({
  children,
  fallbackPath = '/dashboard'
}) => (
  <RoleBasedRoute allowedRoles={['admin', 'manager']} fallbackPath={fallbackPath}>
    {children}
  </RoleBasedRoute>
); 