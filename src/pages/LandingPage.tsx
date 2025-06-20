import AuraBackground from "@/components/Landing/Assets/Auta-1.jpg";
import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";

export default function LandingPage() {
  return (
    <main 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%), url(${AuraBackground})`,
      }}
      role="main"
      aria-label="Astara CRM Landing Page"
    >
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center">
        <Hero />
      </div>
    </main>
  );
} 