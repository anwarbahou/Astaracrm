import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { BlobBackground } from "@/components/Landing/BlobBackground";
import { JoinUs } from "@/components/Landing/JoinUs";
import { LazySection } from "@/components/Landing/LazySection";

export default function LandingPage() {
  return (
    <main 
      className="w-full relative landing-font"
      role="main"
      aria-label="Astara CRM Landing Page"
    >
      {/* Navbar and Hero wrapper with gradient overlay */}
      <div className="relative">
        {/* Black gradient overlay - bottom to top (100% to 40%) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/40 pointer-events-none z-0" />
        
        {/* Navigation - Fixed at top */}
        <div className="relative z-50">
          <Navbar />
        </div>
        
        {/* Hero Content - Full viewport height */}
        <section className="min-h-screen flex items-center justify-center relative z-10">
          <Hero />
        </section>
      </div>
      
      {/* Below-the-fold content - Lazy loaded */}
      <LazySection 
        className="relative z-10"
        threshold={0.1}
        rootMargin="-50px"
        fallbackHeight="min-h-[200px]"
      >
        <JoinUs />
      </LazySection>
    </main>
  );
} 