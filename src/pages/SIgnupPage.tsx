import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuraBackground from "@/components/Landing/Assets/Auta-1.jpg";
import { AnimatedSection } from '@/components/Landing/AnimatedSection';

export default function SIgnupPage() {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signUp(email, password, name);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Don't navigate immediately, wait for email confirmation
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main 
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%), url(${AuraBackground})`,
        }}
        role="main"
        aria-label="Signup Success Page"
      >
        <AnimatedSection 
          variant="scaleIn" 
          delay={200}
          className="w-full max-w-md mx-4"
        >
          <div className="glass-ultra rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            {/* Additional glass overlay for extra depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/10 pointer-events-none"></div>
            
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-green-500/15 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Check Your Email</h1>
              <p className="text-white/80 mb-8 leading-relaxed text-sm">
                We've sent you a confirmation link at{' '}
                <span className="text-white font-medium bg-white/10 px-2 py-1 rounded-lg">{email}</span>.{' '}
                Please check your email and click the link to activate your account.
              </p>
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-white/12 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">Go to Login</span>
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-transparent border border-white/30 text-white/90 font-medium rounded-2xl transition-all duration-300 hover:border-white/60 hover:text-white hover:bg-white/10 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%), url(${AuraBackground})`,
      }}
      role="main"
      aria-label="Signup Page"
    >
      {/* Back to Home Link */}
      <AnimatedSection variant="slideDown" delay={100} threshold={0}>
        <Link
          to="/"
          className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md p-2"
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </AnimatedSection>

      {/* Signup Form */}
      <AnimatedSection 
        variant="scaleIn" 
        delay={300}
        className="w-full max-w-md mx-4"
      >
        <div className="glass-ultra rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Additional glass overlay for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          
          {/* Logo/Brand */}
          <div className="text-center mb-10 relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Join AstaraCRM</h1>
            <p className="text-white/80 text-sm">Create your account and start building the future</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-3 text-white/90">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input-glass w-full px-4 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-0 transition-all duration-300"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a strong password (min. 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <p className="text-white/60 text-xs mt-2 ml-1">Password must be at least 6 characters long</p>
            </div>

            {error && (
              <div className="bg-red-500/15 backdrop-blur-sm border border-red-400/30 text-red-200 px-4 py-4 rounded-2xl text-sm shadow-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </span>
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-white/70">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-white hover:text-white/90 underline underline-offset-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Sign in
              </Link>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <p className="text-xs text-white/60">
                By creating an account, you agree to our{' '}
                <a href="#" className="underline hover:text-white/80 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-white/80 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
