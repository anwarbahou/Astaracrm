import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AnimatedSection 
      variant="slideDown"
      className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6"
      threshold={0}
      delay={200}
    >
      <nav 
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-white font-bold text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md p-1"
            aria-label="AstaraCRM Home"
          >
            AstaraCRM
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a 
              href="#features" 
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1"
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1"
            >
              Contact
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            {/* Create Account Button */}
            <Link
              to="/signup"
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-transparent border border-white/30 text-white/90 font-medium transition-all duration-200 hover:border-white/60 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm lg:text-base"
              aria-label="Create new account"
            >
              Create Account
            </Link>

            {/* Sign In Button */}
            <Link
              to="/login"
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg text-sm lg:text-base"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 py-4 px-4 animate-fade-in"
            role="menu"
          >
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <a 
                href="#features" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
                role="menuitem"
                onClick={toggleMobileMenu}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
                role="menuitem"
                onClick={toggleMobileMenu}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
                role="menuitem"
                onClick={toggleMobileMenu}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
                role="menuitem"
                onClick={toggleMobileMenu}
              >
                Contact
              </a>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-full bg-transparent border border-white/30 text-white/90 font-medium transition-all duration-200 hover:border-white/60 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                  onClick={toggleMobileMenu}
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                  onClick={toggleMobileMenu}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </AnimatedSection>
  );
};
