import { useTranslation } from "react-i18next";

export function ProfileSection() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium">{t('addContactModal.title')}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Fill in the contact information below
      </p>
    </div>
  );
}
