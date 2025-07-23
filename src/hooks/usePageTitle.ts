import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const APP_NAME = 'Skultix';

export function usePageTitle(pageTitle?: string) {
  const { t } = useTranslation();

  useEffect(() => {
    // If no page title is provided, just use the app name
    if (!pageTitle) {
      document.title = APP_NAME;
      return;
    }

    // Translate the page title if it's a translation key
    const translatedTitle = t(pageTitle);

    // Set the document title with the format: "Page Title - App Name"
    document.title = `${translatedTitle} - ${APP_NAME}`;

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = APP_NAME;
    };
  }, [pageTitle, t]);
} 