import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

type User = Database['public']['Tables']['users']['Row'];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, isManager } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // If user is admin or manager, show all user details
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
        // For regular users, show limited user information
        else {
          const { data, error } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, avatar_url, role, status, created_at, updated_at')
            .eq('status', 'active')
            .order('first_name', { ascending: true });

          if (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
            return;
          }

          setUsers(data || []);
        }
      } catch (err) {
        console.error('Error in fetchUsers:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

      fetchUsers();
  }, [isAdmin, isManager]);

  return { users, loading, error };
};

export interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
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
        .select('id, email, first_name, last_name, role, avatar_url')
        .eq('status', 'active')
        .order('first_name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data?.map((user): UserOption => ({
        id: user.id,
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email,
        email: user.email,
        role: user.role || 'user',
        avatar_url: user.avatar_url
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