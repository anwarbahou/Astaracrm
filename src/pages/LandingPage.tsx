import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { BlobBackground } from "@/components/Landing/BlobBackground";
import { JoinUs } from "@/components/Landing/JoinUs";
import { LazySection } from "@/components/Landing/LazySection";

export default function LandingPage() {
  return (
    <main 
      className="min-h-screen w-full relative overflow-x-hidden"
      role="main"
      aria-label="Astara CRM Landing Page"
    >
      {/* Critical above-the-fold content */}
      
      {/* Navigation - Always loaded first for accessibility */}
      <Navbar />
      
      {/* Hero Content - Critical path, always loaded */}
      <section className="min-h-screen flex items-center justify-center relative z-10">
        <Hero />
      </section>
      
      {/* Background animation - Non-critical, loaded after hero */}
      <BlobBackground />
      
      {/* Below-the-fold content - Lazy loaded */}
      <LazySection 
        className="relative z-10"
        threshold={0.15}
        rootMargin="150px"
        fallbackHeight="min-h-[60vh]"
      >
        <JoinUs />
      </LazySection>
    </main>
  );
} 