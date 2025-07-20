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
  // Session timeout management
  sessionWarning: boolean;
  sessionExpiryTime: number | null;
  extendSession: () => Promise<void>;
  getSessionTimeRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mobile detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
};

// Enhanced storage with mobile fallbacks
const getMobileSafeStorage = () => {
  const isMobileDevice = isMobile();
  
  return {
    getItem: (key: string): string | null => {
      try {
        // Try localStorage first, then sessionStorage, then memory fallback
        return localStorage.getItem(key) || sessionStorage.getItem(key) || null;
      } catch (error) {
        console.warn('Storage access error:', error);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        // On mobile, prefer localStorage for persistence
        if (isMobileDevice) {
          localStorage.setItem(key, value);
        } else {
          // Desktop: use sessionStorage for temporary sessions
          const persist = sessionStorage.getItem('persist') === 'true';
          if (persist) {
            localStorage.setItem(key, value);
          }
          sessionStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn('Storage write error:', error);
      }
    },
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn('Storage remove error:', error);
      }
    },
  };
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

// Mobile-optimized session configuration
const SESSION_CONFIG = {
  // Shorter timeouts for mobile to prevent stuck sessions
  DEFAULT_TIMEOUT: isMobile() ? 1000 * 60 * 60 * 12 : 1000 * 60 * 60 * 24 * 7, // 12 hours on mobile
  SHORT_TIMEOUT: 1000 * 60 * 60 * 2, // 2 hours
  EXTENDED_TIMEOUT: 1000 * 60 * 60 * 24 * 7, // 7 days
  REMEMBER_ME_TIMEOUT: 1000 * 60 * 60 * 24 * 30, // 30 days
  
  // More frequent checks on mobile
  WARNING_TIME: isMobile() ? 1000 * 60 * 15 : 1000 * 60 * 30, // 15 min on mobile
  REFRESH_INTERVAL: isMobile() ? 1000 * 60 * 30 : 1000 * 60 * 60, // 30 min on mobile
  
  // Mobile-specific settings
  MOBILE_INIT_TIMEOUT: 15000, // 15 seconds for mobile initialization
  MOBILE_RETRY_DELAY: 2000, // 2 seconds between retries
};

// Get session timeout based on user preference
const getSessionTimeout = (rememberMe: boolean = false): number => {
  if (rememberMe) {
    return SESSION_CONFIG.REMEMBER_ME_TIMEOUT;
  }
  return SESSION_CONFIG.DEFAULT_TIMEOUT;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionExpiryTime, setSessionExpiryTime] = useState<number | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [mobileInitAttempts, setMobileInitAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized role checks to prevent unnecessary re-renders
  const isAdmin = useMemo(() => userProfile?.role === 'admin', [userProfile?.role]);
  const isManager = useMemo(() => 
    userProfile?.role === 'manager' || userProfile?.role === 'admin', 
    [userProfile?.role]
  );

  // Mobile-specific initialization timeout
  useEffect(() => {
    if (isMobile() && initializing) {
      const timeoutId = setTimeout(() => {
        console.warn('Mobile auth initialization timeout - forcing completion');
        setInitializing(false);
        setAuthInitialized(true);
        setMobileInitAttempts(prev => prev + 1);
      }, SESSION_CONFIG.MOBILE_INIT_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [initializing]);

  // Mobile retry logic for failed initialization
  useEffect(() => {
    if (isMobile() && mobileInitAttempts > 0 && mobileInitAttempts < 3) {
      const retryTimeout = setTimeout(() => {
        console.log('Retrying mobile auth initialization...');
        setInitializing(true);
        setAuthInitialized(false);
      }, SESSION_CONFIG.MOBILE_RETRY_DELAY);

      return () => clearTimeout(retryTimeout);
    }
  }, [mobileInitAttempts]);

  // IMPROVED Session timeout monitoring - mobile optimized
  useEffect(() => {
    if (!session?.user || !authInitialized) return;

    const rememberMe = sessionStorage.getItem('persist') === 'true';
    const timeout = getSessionTimeout(rememberMe);
    const sessionExpiry = session.expires_at ? session.expires_at * 1000 : Date.now() + timeout;
    const expiryTime = Math.max(sessionExpiry, Date.now() + timeout);
    
    setSessionExpiryTime(expiryTime);

    // Check for session expiry - mobile optimized frequency
    const checkSessionExpiry = () => {
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;
      
      if (timeUntilExpiry <= 0) {
        console.log('Session expired, logging out...');
        forceLogout('Your session has expired. Please log in again.');
        return;
      }
      
      // Show warning before expiry
      if (timeUntilExpiry <= SESSION_CONFIG.WARNING_TIME && !sessionWarning) {
        setSessionWarning(true);
        console.warn(`Session will expire in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`);
      }
    };

    // Set up periodic checks - mobile optimized frequency
    const intervalId = setInterval(checkSessionExpiry, SESSION_CONFIG.REFRESH_INTERVAL);
    
    // Initial check
    checkSessionExpiry();

    return () => {
      clearInterval(intervalId);
      setSessionWarning(false);
    };
  }, [session, sessionWarning, authInitialized]);

  // IMPROVED Auto-refresh session before expiry - mobile optimized
  useEffect(() => {
    if (!session?.user || !sessionExpiryTime || !authInitialized) return;

    const rememberMe = sessionStorage.getItem('persist') === 'true';
    const timeout = getSessionTimeout(rememberMe);
    const refreshTime = sessionExpiryTime - timeout + SESSION_CONFIG.REFRESH_INTERVAL;

    const refreshSession = async () => {
      try {
        console.log('Attempting to refresh session...');
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Failed to refresh session:', error);
          // On mobile, be more aggressive about logout on refresh failure
          if (isMobile()) {
            console.log('Mobile: Refresh failed, logging out...');
            forceLogout('Session refresh failed. Please log in again.');
          }
          return;
        } else if (data.session) {
          console.log('Session refreshed successfully');
          setSessionWarning(false);
        }
      } catch (err) {
        console.error('Session refresh error:', err);
        if (isMobile()) {
          forceLogout('Session refresh error. Please log in again.');
        }
      }
    };

    const timeUntilRefresh = refreshTime - Date.now();
    if (timeUntilRefresh > 0) {
      const timeoutId = setTimeout(refreshSession, timeUntilRefresh);
      return () => clearTimeout(timeoutId);
    } else {
      // Refresh immediately if past refresh time
      refreshSession();
    }
  }, [session, sessionExpiryTime, authInitialized]);

  // Clear error on navigation to login
  useEffect(() => {
    if (location.pathname === '/login' && error) {
      setError(null);
    }
  }, [location.pathname, error]);

  // IMPROVED logout with mobile-optimized storage clearing
  const forceLogout = useCallback((msg?: string) => {
    console.log('Force logout called:', msg);
    
    // Clear all auth state
    setUser(null);
    setUserProfile(null);
    setSession(null);
    setLoading(false);
    setError(null);
    setWasAuthenticated(false);
    setAuthInitialized(false);
    setMobileInitAttempts(0);
    
    // Mobile-optimized storage clearing
    try {
      const keysToRemove = [
        'user_profile_',
        'persist',
        'supabase.auth.token',
        'supabase.auth.user'
      ];
      
      // Clear sessionStorage items
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && keysToRemove.some(prefix => key.startsWith(prefix))) {
          sessionStorage.removeItem(key);
        }
      }
      
      // Clear localStorage items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && keysToRemove.some(prefix => key.startsWith(prefix))) {
          localStorage.removeItem(key);
        }
      }
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

  // IMPROVED Auth state change handler - mobile optimized
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    setInitializing(true);
    setSession(session);
    setUser(session?.user ?? null);

    try {
      // Handle explicit sign out events
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUserProfile(null);
        setWasAuthenticated(false);
        setAuthInitialized(true);
        setInitializing(false);
        setMobileInitAttempts(0);
        return;
      }

      if (session?.user) {
        // User is authenticated
        setWasAuthenticated(true);
        
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          if (!profile) {
            console.log('Creating user profile...');
            await ensureUserProfile(session.user);
            const newProfile = await fetchUserProfile(session.user.id);
            setUserProfile(newProfile);
          }
        }
      } else {
        // No session - mobile optimized handling
        if (wasAuthenticated && location.pathname !== '/login') {
          console.log('No session but user was authenticated, redirecting to login');
          setUserProfile(null);
          setWasAuthenticated(false);
          // On mobile, be more aggressive about logout
          if (isMobile()) {
            forceLogout('Session lost. Please log in again.');
          }
        } else {
          // New visitor or on login page - just clear profile and continue
          setUserProfile(null);
          setWasAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error in auth state change handler:', error);
      setError('Authentication error occurred');
    } finally {
      setInitializing(false);
      setAuthInitialized(true);
    }
  }, [wasAuthenticated, location.pathname, forceLogout]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Mobile-optimized timeout
    const timeoutId = setTimeout(() => {
      if (initializing) {
        console.warn('Auth initialization timeout - forcing completion');
        setInitializing(false);
        setAuthInitialized(true);
      }
    }, isMobile() ? SESSION_CONFIG.MOBILE_INIT_TIMEOUT : 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [handleAuthStateChange, initializing]);
  
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
      console.log('Signing in with rememberMe:', rememberMe, 'Mobile:', isMobile());
      
      // Set the persistence flag before signing in
      if (rememberMe) {
        sessionStorage.setItem('persist', 'true');
      } else {
        sessionStorage.removeItem('persist');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data.session) {
        console.log('✅ Sign in successful:', data.session.user.email);
      }

      return { error };
    } catch (err) {
      console.error('Signin error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }
      
      // Perform comprehensive cleanup
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setMobileInitAttempts(0);
      if (user?.id) {
        sessionStorage.removeItem(`user_profile_${user.id}`);
      }
      console.log('✅ Sign out successful');
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
    loading: (loading || initializing) && !authInitialized,
    isAdmin,
    isManager,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    refreshUserProfile,
    forceRefresh,
    error,
    // Session timeout management
    sessionWarning,
    sessionExpiryTime,
    extendSession: async () => {
      const rememberMe = sessionStorage.getItem('persist') === 'true';
      const timeout = getSessionTimeout(rememberMe);
      const newExpiryTime = Date.now() + timeout;
      setSessionExpiryTime(newExpiryTime);
      console.log(`Session extended to: ${new Date(newExpiryTime).toISOString()}`);
    },
    getSessionTimeRemaining: () => {
      if (!sessionExpiryTime) return 0;
      const now = Date.now();
      const timeUntilExpiry = sessionExpiryTime - now;
      return timeUntilExpiry;
    },
  }), [
    user,
    userProfile,
    session,
    loading,
    initializing,
    authInitialized,
    isAdmin,
    isManager,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    refreshUserProfile,
    forceRefresh,
    error,
    sessionWarning,
    sessionExpiryTime,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 