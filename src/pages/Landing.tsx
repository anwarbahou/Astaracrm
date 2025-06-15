
import { useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CredibilitySection } from '@/components/landing/CredibilitySection';
import { Footer } from '@/components/landing/Footer';
import { SignInModal } from '@/components/auth/SignInModal';
import { SignUpModal } from '@/components/auth/SignUpModal';

interface LandingProps {
  onSignIn: () => void;
}

const Landing = ({ onSignIn }: LandingProps) => {
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const handleSwitchToSignUp = () => {
    setSignInModalOpen(false);
    setSignUpModalOpen(true);
  };
  
  const handleSwitchToSignIn = () => {
    setSignUpModalOpen(false);
    setSignInModalOpen(true);
  };

  const handleSuccessfulAuth = () => {
    setSignInModalOpen(false);
    setSignUpModalOpen(false);
    onSignIn();
  }

  return (
    <div className="bg-background min-h-screen">
      <main>
        <HeroSection onGetStarted={() => setSignUpModalOpen(true)} onSignIn={() => setSignInModalOpen(true)} />
        <FeaturesSection />
        <CredibilitySection />
      </main>
      <Footer />
      <SignInModal
        isOpen={isSignInModalOpen}
        onOpenChange={setSignInModalOpen}
        onSignIn={handleSuccessfulAuth}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onOpenChange={setSignUpModalOpen}
        onSignUp={handleSuccessfulAuth}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </div>
  );
};

export default Landing;
