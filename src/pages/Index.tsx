
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('indexPage.title')}</h1>
        <p className="text-xl text-muted-foreground">{t('indexPage.subtitle')}</p>
      </div>
    </div>
  );
};

export default Index;
