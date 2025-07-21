import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/supabase';

type UserRole = Database['public']['Enums']['user_role'];

export const useRoleAccess = () => {
  const { userProfile, isAdmin, isManager } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return userProfile?.role ? roles.includes(userProfile.role as UserRole) : false;
  };

  const canAccess = {
    adminOnly: isAdmin,
    managerAndAbove: isManager,
    userAndAbove: true, // All authenticated users
  };

  const permissions = {
    // User management
    canManageUsers: isAdmin,
    canViewUsers: isManager,
    
    // System settings
    canManageSettings: isAdmin,
    canViewReports: isManager,
    
    // Client/Deal management
    canDeleteClients: isManager,
    canEditAllClients: isManager,
    canCreateClients: true,
    canViewClients: true,
    
    // Advanced features
    canAccessWorkflows: isManager,
    canViewActivityLogs: isManager,
    canManageRoles: isAdmin,
  };

  return {
    userRole: userProfile?.role,
    isAdmin,
    isManager,
    hasRole,
    hasAnyRole,
    canAccess,
    permissions,
  };
}; 