
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onSignIn }) => {
  const { t } = useTranslation('landingPage');

  return (
    <section className="relative bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5 [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]"></div>
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24 text-center relative">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 animate-fade-in">
          {t('hero.title')}
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in [animation-delay:200ms]">
          {t('hero.subtitle')}
        </p>
        <div className="flex justify-center gap-4 animate-fade-in [animation-delay:400ms]">
          <Button size="lg" onClick={onGetStarted}>
            {t('hero.getStarted')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={onSignIn}>
            {t('hero.signIn')}
          </Button>
        </div>
        <div className="relative mt-16 animate-fade-in [animation-delay:600ms]">
            <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop"
                alt="Wolfhunt CRM Dashboard"
                className="rounded-xl border shadow-2xl shadow-primary/10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};
