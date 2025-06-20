import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { BlobBackground } from "@/components/Landing/BlobBackground";
import { JoinUs } from "@/components/Landing/JoinUs";
import { LazySection } from "@/components/Landing/LazySection";

export default function LandingPage() {
  return (
    <main 
      className="w-full relative"
      role="main"
      aria-label="Astara CRM Landing Page"
    >
      {/* Background animation - Fixed positioning */}
      <BlobBackground />
      
      {/* Navigation - Fixed at top */}
      <Navbar />
      
      {/* Hero Content - Full viewport height */}
      <section className="min-h-screen flex items-center justify-center relative z-10">
        <Hero />
      </section>
      
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