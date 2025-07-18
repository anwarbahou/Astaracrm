import { LandingButton } from "./LandingButton";
import { Hero3D } from "./Hero3D";

export const Hero = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 landing-font">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left Section: Text and Buttons */}
        <div className="flex-1 text-left md:pr-8">
          <h1 id="hero-heading" className="mb-4">
            <span className="block font-sora font-bold text-white leading-tight tracking-tight text-[36px] sm:text-[44px] lg:text-[58px]">THE FUTURE IS</span>
            <span className="block font-sora font-bold text-white leading-tight tracking-tight text-[36px] sm:text-[44px] lg:text-[58px]">BUILT BY YOU</span>
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white/90 leading-relaxed mb-4">
            The Future of Customer Relationship Management
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl">
            Transform your business with intelligent automation, seamless integrations, and powerful analytics that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <LandingButton 
              variant="primary" 
              type="button"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
            >
Work with us            </LandingButton>
            <LandingButton 
              variant="secondary" 
              type="button"
              className="w-full sm:w-auto px-8 py-4 text-lg"
            >
Learn more            </LandingButton>
          </div>
        </div>
        {/* Right Section: 3D Logo */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem]">
            <Hero3D />
          </div>
        </div>
      </div>
    </div>
  );
}; 