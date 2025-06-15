
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation('landingPage');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">{t('footer.tagline')}</h3>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
                <Button variant="link" className="text-secondary-foreground">{t('footer.features')}</Button>
                <Button variant="link" className="text-secondary-foreground">{t('footer.pricing')}</Button>
                <Button variant="link" className="text-secondary-foreground">{t('footer.contact')}</Button>
                <Button variant="link" className="text-secondary-foreground">{t('footer.support')}</Button>
            </nav>
            <div className="flex gap-4">
                <Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Github className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Linkedin className="h-5 w-5" /></Button>
            </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p className="mb-2 sm:mb-0">{t('footer.rights', { year })}</p>
            <div className="flex gap-4">
                <Button variant="link" className="text-muted-foreground px-0 h-auto">{t('footer.privacy')}</Button>
                <Button variant="link" className="text-muted-foreground px-0 h-auto">{t('footer.terms')}</Button>
            </div>
        </div>
      </div>
    </footer>
  );
};
