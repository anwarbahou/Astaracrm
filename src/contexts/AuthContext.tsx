import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  avatar_url: string | null;
  phone: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  timezone?: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateUserRole: (userId: string, role: string) => Promise<{ error: any }>;
  refreshUserProfile: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  error: string | null;
  retry: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Function to fetch user profile from our custom users table
const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Function to ensure user profile exists in our custom users table
const ensureUserProfile = async (user: User) => {
  try {
    // Check if user profile exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      // Create user profile if it doesn't exist with default 'user' role
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: 'user', // Default role for new users
        });

      if (error) {
        console.error('Error creating user profile:', error);
        // Don't throw here - let auth continue even if profile creation fails
      } else {
        console.log('✅ User profile created successfully with default user role');
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    // Don't throw here - let auth continue even if profile creation fails
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Computed properties for role checking
  const isAdmin = userProfile?.role === 'admin';
  const isManager = userProfile?.role === 'manager' || userProfile?.role === 'admin';

  const retry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(c => c + 1);
  };

  const refreshUserProfile = async () => {
    try {
      if (user) {
        console.log('🔄 Manually refreshing user profile...');
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
        console.log('✅ User profile refreshed:', profile);
      }
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      setError('Failed to refresh user profile');
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    try {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await ensureUserProfile(session.user);
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Error handling auth state change:', err);
      setError('Failed to update auth state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          await ensureUserProfile(session.user);
          const profile = await fetchUserProfile(session.user.id);
          
          if (!mounted) return;
          
          setSession(session);
          setUser(session.user);
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setError('Failed to initialize authentication.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [retryCount]);

  // Add real-time subscription for user profile changes
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to changes in the users table for the current user
    const profileSubscription = supabase
      .channel('user-profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('User profile updated:', payload);
          // Update the user profile state with the new data
          setUserProfile(payload.new as UserProfile);
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
    };
  }, [user?.id]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(' ')[0] || name,
            last_name: name.split(' ').slice(1).join(' ') || '',
          },
        },
      });

      // If signup succeeds but user is returned (email confirmation disabled)
      if (data.user && !error) {
        console.log('✅ Signup successful:', data.user.email);
        // User profile will be created by the auth state change listener
      }

      return { error };
    } catch (err) {
      console.error('Signup error:', err);
      return { error: err as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return { error };
      }

      // Refresh current user profile if updating own role
      if (userId === user?.id) {
        await refreshUserProfile();
      }

      return { error: null };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { error };
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 Force refreshing user session and profile...');
    console.log('Current user:', user);
    console.log('Current userProfile:', userProfile);
    
    // Get fresh session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return;
    }
    
    if (session?.user) {
      console.log('Session user:', session.user);
      // Force refresh user profile
      const profile = await fetchUserProfile(session.user.id);
      console.log('Fresh profile from database:', profile);
      setUserProfile(profile);
      console.log('✅ Force refresh complete. New userProfile:', profile);
      console.log('isAdmin should be:', profile?.role === 'admin');
      console.log('isManager should be:', profile?.role === 'manager' || profile?.role === 'admin');
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    isAdmin,
    isManager,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    refreshUserProfile,
    forceRefresh,
    error,
    retry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 