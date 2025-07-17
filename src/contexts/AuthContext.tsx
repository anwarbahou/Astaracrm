import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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
  refreshUserProfile: () => Promise<UserProfile | null>;
  forceRefresh: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Optimized profile fetching with caching
const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const cacheKey = `user_profile_${userId}`;
  const cachedProfile = sessionStorage.getItem(cacheKey);
  
  if (cachedProfile) {
    return JSON.parse(cachedProfile);
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    if (data) {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Optimized profile creation with retry
const ensureUserProfile = async (user: User, retryCount = 0): Promise<void> => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        role: 'user',
        status: 'active',
      });

      if (error) {
        if (retryCount < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return ensureUserProfile(user, retryCount + 1);
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
  }
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const SESSION_TIMEOUT = 1000 * 60 * 60 * 24; // 24 hours

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized role checks to prevent unnecessary re-renders
  const isAdmin = useMemo(() => userProfile?.role === 'admin', [userProfile?.role]);
  const isManager = useMemo(() => 
    userProfile?.role === 'manager' || userProfile?.role === 'admin', 
    [userProfile?.role]
  );

  // Clear error on navigation to login
  useEffect(() => {
    if (location.pathname === '/login' && error) {
      setError(null);
    }
  }, [location.pathname, error]);

  // Optimized logout with cleanup
  const forceLogout = useCallback((msg?: string) => {
    // Clear all auth state
    setUser(null);
    setUserProfile(null);
    setSession(null);
    setLoading(false);
    setError(null);
    
    // Clear storage
    try {
      sessionStorage.clear();
    localStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
    
    // Redirect with minimal delay
    requestAnimationFrame(() => {
      navigate('/login', { 
        replace: true, 
        state: { error: msg || 'Session expired. Please log in again.' } 
      });
    });
  }, [navigate]);

  // Optimized profile refresh
  const refreshUserProfile = useCallback(async () => {
    if (!user?.id) return null;
    
    // Invalidate cache before fetching
    sessionStorage.removeItem(`user_profile_${user.id}`);
    
    try {
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
        return profile;
      }
      throw new Error('Failed to fetch profile');
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError('Failed to refresh user profile');
      return null;
    }
  }, [user?.id]);

  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    setInitializing(true);
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
        if (!profile) {
          await ensureUserProfile(session.user);
          const newProfile = await fetchUserProfile(session.user.id);
          setUserProfile(newProfile);
        }
      }
    } else {
      setUserProfile(null);
    }
    setInitializing(false);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);
  
  // Optimized profile subscription
  useEffect(() => {
    if (!user?.id) return;

    const profileSubscription = supabase
      .channel(`user-profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Profile updated:', payload.new);
          setUserProfile(payload.new as UserProfile);
          sessionStorage.setItem(
            `user_profile_${user.id}`,
            JSON.stringify(payload.new)
          );
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
      // Set the persistence flag before signing in
      if (rememberMe) {
        sessionStorage.setItem('persist', 'true');
      } else {
        sessionStorage.removeItem('persist');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (err) {
      console.error('Signin error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }
      // Perform comprehensive cleanup
      setUser(null);
      setUserProfile(null);
      setSession(null);
      if (user?.id) {
        sessionStorage.removeItem(`user_profile_${user.id}`);
      }
      return { error: null };
    } catch (err) {
      console.error('Signout error:', err);
      return { error: err as AuthError };
    }
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
      // Force refresh user profile by clearing cache first
      sessionStorage.removeItem(`user_profile_${session.user.id}`);
      const profile = await fetchUserProfile(session.user.id);
      console.log('Fresh profile from database:', profile);
      setUserProfile(profile);
      console.log('✅ Force refresh complete. New userProfile:', profile);
    }
  };

  const value = useMemo(() => ({
    user,
    userProfile,
    session,
    loading: loading || initializing,
    isAdmin,
    isManager,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    refreshUserProfile,
    forceRefresh,
    error,
  }), [
    user,
    userProfile,
    session,
    loading,
    initializing,
    isAdmin,
    isManager,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    refreshUserProfile,
    forceRefresh,
    error,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 