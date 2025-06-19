import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import { useQuery } from '@tanstack/react-query';

type User = Database['public']['Tables']['users']['Row'];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile, isAdmin, isManager } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // If user is admin or manager, show all users
        if (isAdmin || isManager) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('status', 'active')
            .order('first_name', { ascending: true });

          if (error) {
            console.error('Error fetching all users:', error);
            setError(error.message);
            return;
          }

          setUsers(data || []);
        } 
        // If regular user, only show themselves
        else if (user?.id && userProfile) {
          // Convert UserProfile to User type with required fields
          const currentUserAsUser: User = {
            id: userProfile.id,
            email: userProfile.email,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            role: userProfile.role || 'user',
            avatar_url: userProfile.avatar_url,
            phone: userProfile.phone,
            status: userProfile.status || 'active',
            created_at: userProfile.created_at || new Date().toISOString(),
            updated_at: userProfile.updated_at || new Date().toISOString(),
            // Add missing fields with defaults
            last_login_at: new Date().toISOString(),
            preferences: {},
            timezone: 'UTC'
          };
          
          setUsers([currentUserAsUser]);
        }
        // If no user or profile, show empty list
        else {
          setUsers([]);
        }
      } catch (err) {
        console.error('Unexpected error fetching users:', err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when we have user profile information
    if (userProfile !== null) {
      fetchUsers();
    }
  }, [user?.id, userProfile, isAdmin, isManager]);

  return { users, loading, error };
};

export interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useUsersForSelection() {
  const { user, userProfile } = useAuth();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users-selection', userProfile?.role],
    queryFn: async () => {
      // If user is not authenticated, return empty array
      if (!user) return [];

      let query = supabase
        .from('users')
        .select('id, email, first_name, last_name, role')
        .eq('status', 'active')
        .order('first_name', { ascending: true });

      // If user is not admin/manager, only show themselves
      if (userProfile?.role !== 'admin' && userProfile?.role !== 'manager') {
        query = query.eq('id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data?.map((user): UserOption => ({
        id: user.id,
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email,
        email: user.email,
        role: user.role || 'user'
      })) || [];
    },
    enabled: !!user, // Only fetch when user is authenticated
  });

  return {
    users,
    isLoading,
    error,
    currentUser: user,
    userRole: userProfile?.role
  };
} 