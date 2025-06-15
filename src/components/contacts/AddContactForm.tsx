
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import {
  ProfileSection,
  BasicInfoSection,
  ProfessionalInfoSection,
  LocationStatusSection,
  TagsSection,
  NotesSection,
  ContactFormData,
} from './contact-form-sections';
import { Button } from '@/components/ui/button';

interface AddContactFormProps {
  onOpenChange: (open: boolean) => void;
}

const initialFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  company: "",
  country: "",
  status: "",
  notes: "",
  tags: [],
  avatar: "",
};

export function AddContactForm({ onOpenChange }: AddContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting contact data:', formData);
    toast({
      title: t("addContactModal.successTitle"),
      description: t("addContactModal.successDescription"),
    });
    onOpenChange(false);
    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileSection formData={formData} />
      <BasicInfoSection formData={formData} setFormData={setFormData} />
      <ProfessionalInfoSection formData={formData} setFormData={setFormData} />
      <LocationStatusSection formData={formData} setFormData={setFormData} />
      <TagsSection formData={formData} setFormData={setFormData} />
      <NotesSection formData={formData} setFormData={setFormData} />
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit">{t('addContactModal.submitButton')}</Button>
      </div>
    </form>
  );
}
