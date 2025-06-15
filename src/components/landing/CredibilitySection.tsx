
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CredibilitySection = () => {
  const { t } = useTranslation('landingPage');
  
  const partnerLogos = ['TechCrunch', 'Forbes', 'FastCompany', 'Inc.', 'Wired'];

  return (
    <section className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
          {t('credibility.title')}
        </h2>
        <div className="max-w-3xl mx-auto mt-8">
            <Card className="bg-background text-left shadow-lg">
                <CardContent className="p-8">
                    <p className="text-lg md:text-xl font-medium text-foreground mb-6">
                        {t('credibility.testimonial')}
                    </p>
                    <div className="flex items-center">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>AK</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                            <p className="font-semibold">{t('credibility.author')}</p>
                            <p className="text-sm text-muted-foreground">Tech Innovate</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="mt-16">
            <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                {partnerLogos.map(logo => (
                    <span key={logo} className="text-xl font-semibold text-muted-foreground/60 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all">
                        {logo}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};
