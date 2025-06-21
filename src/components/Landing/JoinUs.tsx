import React, { useState } from 'react';
import { AnimatedSection, FadeInSection, SlideUpSection, ScaleInSection } from './AnimatedSection';

export const JoinUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ fullName: '', email: '', phone: '' });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <FadeInSection className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-ultra rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Welcome to the Future!</h3>
              <p className="text-white/80 text-lg">
                Thank you for joining us. We'll be in touch soon with exclusive updates and early access opportunities.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>
    );
  }

  return (
    <FadeInSection className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-ultra rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Glass overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            {/* Text Content */}
            <div className="space-y-8">
              <SlideUpSection delay={200}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  Join the
                  <span className="block text-white">
                    Revolution
                  </span>
                </h2>
                <p className="text-xl sm:text-2xl text-white/90 leading-relaxed mb-6">
                  Be among the first to experience the future of CRM. Get exclusive early access, special pricing, and direct input into our development process.
                </p>
              </SlideUpSection>
              
              <div className="space-y-6">
                <AnimatedSection variant="slideLeft" delay={400} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Early Access</h3>
                    <p className="text-white/70">Be the first to try new features</p>
                  </div>
                </AnimatedSection>
                
                <AnimatedSection variant="slideLeft" delay={500} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Special Pricing</h3>
                    <p className="text-white/70">Exclusive discounts for early adopters</p>
                  </div>
                </AnimatedSection>
                
                <AnimatedSection variant="slideLeft" delay={600} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Direct Input</h3>
                    <p className="text-white/70">Shape the product with your feedback</p>
                  </div>
                </AnimatedSection>
              </div>
            </div>

            {/* Form */}
            <AnimatedSection variant="slideRight" delay={300} className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Get Started Today</h3>
                <p className="text-white/70">Join thousands of forward-thinking businesses</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-3 text-white/90">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="input-glass w-full px-4 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-0 transition-all duration-300"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-3 text-white/90">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-glass w-full px-4 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-0 transition-all duration-300"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-3 text-white/90">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="input-glass w-full px-4 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-0 transition-all duration-300"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-white/12 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Joining...
                      </div>
                    ) : (
                      'Join the Revolution'
                    )}
                  </span>
                </button>
              </form>

              <p className="text-xs text-white/60 text-center">
                By joining, you agree to our{' '}
                <a href="#" className="underline hover:text-white/80 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-white/80 transition-colors">Privacy Policy</a>.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};
