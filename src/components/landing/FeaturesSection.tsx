
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Star, Send, MessageSquare, LayoutDashboard, BarChart3, Check } from 'lucide-react';

const featureIcons = {
  aiLeads: BrainCircuit,
  leadScoring: Star,
  campaigns: Send,
  aiMessaging: MessageSquare,
  crmHub: LayoutDashboard,
  analytics: BarChart3,
};

export const FeaturesSection = () => {
  const { t } = useTranslation('landingPage');
  const features = Object.keys(featureIcons) as (keyof typeof featureIcons)[];

  return (
    <section id="features" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t('features.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('features.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((featureKey) => {
            const Icon = featureIcons[featureKey];
            return (
              <div key={featureKey} className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{t(`features.${featureKey}.title`)}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{t(`features.${featureKey}.description`)}</p>
                <ul className="space-y-2 text-sm">
                  {(t(`features.${featureKey}.points`, { returnObjects: true }) as string[]).map((point, index) => (
                     <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 mr-2 mt-1 shrink-0 text-green-500" /> 
                        <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
