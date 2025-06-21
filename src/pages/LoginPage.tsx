import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedSection } from '@/components/Landing/AnimatedSection';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Lazy load background image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/src/components/Landing/Assets/Auta-1.jpg';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-opacity duration-1000 ${
        imageLoaded ? 'opacity-100' : 'opacity-90'
      }`}
      style={{
        background: imageLoaded 
          ? `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%), url(/src/components/Landing/Assets/Auta-1.jpg) center/cover fixed no-repeat`
          : 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%)'
      }}
      role="main"
      aria-label="Login Page"
    >
      {/* Fallback gradient while image loads */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      )}

      {/* Back to Home Link */}
      <AnimatedSection variant="slideDown" delay={100} threshold={0}>
        <Link
          to="/"
          className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md p-2 z-20"
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </AnimatedSection>

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
