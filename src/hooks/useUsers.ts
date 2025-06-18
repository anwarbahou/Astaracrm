import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

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