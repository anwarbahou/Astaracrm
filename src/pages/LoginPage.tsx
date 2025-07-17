import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedSection } from '@/components/Landing/AnimatedSection';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [initTimedOut, setInitTimedOut] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [initAttempts, setInitAttempts] = useState(0);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Progressive timeout with retry
  useEffect(() => {
    if (!authLoading || initAttempts >= 3) return;
    
    const timeoutId = setTimeout(() => {
      setInitTimedOut(true);
      setInitAttempts(prev => prev + 1);
    }, Math.min(5000 * (initAttempts + 1), 15000)); // Progressive timeout: 5s, 10s, 15s

    return () => clearTimeout(timeoutId);
  }, [authLoading, initAttempts]);

  const handleRetry = () => {
    setInitTimedOut(false);
    setError('');
    setInitAttempts(0);
    window.location.reload();
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Lazy load background image with timeout
  useEffect(() => {
    const img = new Image();
    const timeoutId = setTimeout(() => setImageLoaded(true), 3000); // Fallback after 3s

    img.onload = () => {
      clearTimeout(timeoutId);
      setImageLoaded(true);
    };

    img.src = '/src/components/Landing/Assets/Auta-1.jpg';

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!authLoading) return;
    const timeoutId = setTimeout(() => setInitTimedOut(true), 10000);
    return () => clearTimeout(timeoutId);
  }, [authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      setError('No internet connection. Please check your connection and try again.');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password, rememberMe);
      
      if (signInError) {
        if (signInError.message.toLowerCase().includes('network') || 
            signInError.message.toLowerCase().includes('fetch') ||
            signInError.message.toLowerCase().includes('timeout')) {
          setError('Network error. Please check your connection and try again.');
        } else if (signInError.message.toLowerCase().includes('credentials') ||
                   signInError.message.toLowerCase().includes('password') ||
                   signInError.message.toLowerCase().includes('email')) {
          setError('Invalid email or password.');
        } else if (signInError.message.toLowerCase().includes('too many')) {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(signInError.message);
        }
        return;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message?.toLowerCase().includes('network') ||
          err?.message?.toLowerCase().includes('fetch') ||
          err?.message?.toLowerCase().includes('timeout')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if auth is still initializing
  if (authLoading && !initTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing... {initAttempts > 0 ? `(Attempt ${initAttempts + 1}/3)` : ''}</p>
          {initAttempts > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">This is taking longer than usual...</p>
          )}
        </div>
      </div>
    );
  }

  // Show error if initialization took too long
  if ((authLoading && initTimedOut) || initAttempts >= 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-muted-foreground mb-4">
            {initAttempts >= 3 
              ? "We're having trouble connecting to our servers. This might be due to:"
              : "Initialization took too long. This might be due to:"}
          </p>
          <ul className="text-sm text-muted-foreground mb-6 text-left list-disc pl-4">
            <li>Slow internet connection</li>
            <li>Server maintenance</li>
            <li>VPN or proxy issues</li>
            <li>Firewall restrictions</li>
          </ul>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show offline state
  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-destructive text-5xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold mb-2">No Internet Connection</h2>
          <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <main 
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-opacity duration-1000 ${
        imageLoaded ? 'opacity-100' : 'opacity-90'
      }`}
      style={{
        background: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%)${
          imageLoaded ? `, url(/src/components/Landing/Assets/Auta-1.jpg) center/cover fixed no-repeat` : ''
        }`
      }}
      role="main"
      aria-label="Login Page"
    >
      {/* Fallback gradient while image loads */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      )}

      {/* Login Form */}
      <AnimatedSection 
        variant="scaleIn" 
        delay={300}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="glass-ultra rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Additional glass overlay for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          
          {/* Logo/Brand */}
          <div className="text-center mb-10 relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome Back</h1>
            <p className="text-white/80 text-sm">Sign in to your AstaraCRM account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-3 text-white/90">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-glass w-full px-4 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-0 transition-all duration-300"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-3 text-white/90">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-glass w-full px-4 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-0 transition-all duration-300"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-white/80 text-sm select-none cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox accent-primary mr-2"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>

            {error && (
              <div className="bg-red-500/15 backdrop-blur-sm border border-red-400/30 text-red-200 px-4 py-4 rounded-2xl text-sm shadow-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-white/12 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-white hover:text-white/90 underline underline-offset-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Sign up
              </Link>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <a 
                href="#" 
                className="text-sm text-white/70 hover:text-white/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
