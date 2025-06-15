
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionProps } from ".";

export function BasicInfoSection({ formData, setFormData }: SectionProps) {
  const { t } = useTranslation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{t('addContactModal.firstNameLabel')}</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder={t('addContactModal.firstNamePlaceholder')}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">{t('addContactModal.lastNameLabel')}</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder={t('addContactModal.lastNamePlaceholder')}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">{t('addContactModal.emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('addContactModal.emailPlaceholder')}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">{t('addContactModal.phoneLabel')}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('addContactModal.phonePlaceholder')}
          />
        </div>
      </div>
    </>
  );
}
