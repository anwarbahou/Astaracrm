import { LandingButton } from "./LandingButton";
import { AnimatedSection } from './AnimatedSection';

export const Hero = () => {
  return (
    <AnimatedSection 
      className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8"
      variant="fadeIn"
      threshold={0.1}
    >
      <div className="w-full max-w-6xl mx-auto text-center">
        {/* Main Hero Text */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h1 
            id="hero-heading"
            className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight tracking-tight"
          >
            <span className="block">THE FUTURE IS</span>
            <span className="block">BUILT BY YOU</span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white/90 leading-relaxed max-w-4xl mx-auto">
            The Future of Customer Relationship Management
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Transform your business with intelligent automation, seamless integrations, 
            and powerful analytics that drive real results.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 md:mb-20">
          <LandingButton 
            variant="primary" 
            type="button"
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
          >
            Start Free Trial
          </LandingButton>
          <LandingButton 
            variant="secondary" 
            type="button"
            className="w-full sm:w-auto px-8 py-4 text-lg"
          >
            Watch Demo
          </LandingButton>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-white/80" role="region" aria-label="Key features">
          <div className="text-center group hover:scale-105 transition-transform duration-300 will-change-transform">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
              10x
            </div>
            <div className="text-sm sm:text-base uppercase tracking-wide font-medium">
              Faster Setup
            </div>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300 will-change-transform">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
              99.9%
            </div>
            <div className="text-sm sm:text-base uppercase tracking-wide font-medium">
              Uptime Guarantee
            </div>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300 will-change-transform">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
              24/7
            </div>
            <div className="text-sm sm:text-base uppercase tracking-wide font-medium">
              Expert Support
            </div>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
}; 