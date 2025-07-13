import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, SUPABASE_URL_EXPORT, SUPABASE_ANON_KEY_EXPORT } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

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
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>;
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
      } else {
        console.log('✅ User profile created successfully with default user role');
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Clear error when navigating to /login
  useEffect(() => {
    if (location.pathname === '/login' && error) {
      setError(null);
    }
  }, [location.pathname]);

  // Computed properties for role checking
  const isAdmin = userProfile?.role === 'admin';
  const isManager = userProfile?.role === 'manager' || userProfile?.role === 'admin';

  const retry = () => {
    setError(null);
    setLoading(true);
    // Simple retry - just reinitialize auth
    initializeAuth();
  };

  // Helper to handle logout and redirect
  const forceLogout = (msg?: string) => {
    setUser(null);
    setUserProfile(null);
    setSession(null);
    setLoading(false);
    setError(null);
    localStorage.clear();
    setTimeout(() => {
      navigate('/login', { replace: true, state: { error: msg || 'Session expired. Please log in again.' } });
    }, 100);
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

  // Simplified auth initialization
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        if (sessionError.message?.toLowerCase().includes('jwt expired') || 
            sessionError.message?.toLowerCase().includes('token')) {
          forceLogout('Session expired. Please log in again.');
          return;
        }
        setError('Network error. Please check your connection.');
        setLoading(false);
        return;
      }

      if (session?.user) {
        await ensureUserProfile(session.user);
        const profile = await fetchUserProfile(session.user.id);
        
        setSession(session);
        setUser(session.user);
        setUserProfile(profile);
        setError(null);
        console.log('✅ Auth initialized successfully');
      } else {
        // No session - user needs to login
        setUser(null);
        setUserProfile(null);
        setSession(null);
      }
    } catch (err: any) {
      console.error('Auth initialization error:', err);
      if (err?.message?.toLowerCase().includes('jwt expired') || 
          err?.message?.toLowerCase().includes('token')) {
        forceLogout('Session expired. Please log in again.');
        return;
      }
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthContext state:', { loading, error, user, userProfile });
  }, [loading, error, user, userProfile]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add real-time subscription for user profile changes
  useEffect(() => {
    if (!user?.id) return;

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

      if (data.user && !error) {
        console.log('✅ Signup successful:', data.user.email);
      }

      return { error };
    } catch (err) {
      console.error('Signup error:', err);
      return { error: err as AuthError };
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      if (rememberMe) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      } else {
        // Create a temporary client with persistSession: false
        const { createClient } = await import('@supabase/supabase-js');
        const tempClient = createClient(
          SUPABASE_URL_EXPORT,
          SUPABASE_ANON_KEY_EXPORT,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
              detectSessionInUrl: true,
            },
          }
        );
        const { data, error } = await tempClient.auth.signInWithPassword({
          email,
          password,
        });
        if (data?.session) {
          // Set the session in the main client (in-memory only)
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
          // Remove persisted session from localStorage (if any)
          try {
            const key = Object.keys(localStorage).find(k => k.includes('supabase.auth.token'));
            if (key) localStorage.removeItem(key);
          } catch (e) { /* ignore */ }
        }
        return { error };
      }
    } catch (err) {
      console.error('Signin error:', err);
      return { error: err as AuthError };
    }
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