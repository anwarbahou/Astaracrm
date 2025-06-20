import { LandingButton } from "./LandingButton";

export const Hero = () => {
  return (
    <section 
      className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="w-full max-w-6xl mx-auto text-center">
        {/* Main Hero Text with Optimized Typography */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h1 
            id="hero-heading"
            className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight tracking-tight"
          >
            <span className="block animate-fade-in">THE FUTURE IS</span>
            <span className="block animate-fade-in-delayed">BUILT BY YOU</span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white/90 leading-relaxed max-w-4xl mx-auto">
            The Future of Customer Relationship Management
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Transform your business with intelligent automation, seamless integrations, 
            and powerful analytics that drive real results.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 md:mb-20 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards', opacity: 0 }}>
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



      </div>
    </section>
  );
}; 