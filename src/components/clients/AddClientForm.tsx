
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import {
  ProfileSection,
  BasicInfoSection,
  BusinessInfoSection,
  TagsSection,
  NotesSection,
} from './ClientFormSections';
import { Button } from '@/components/ui/button';

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  industry: string;
  stage: string;
  owner: string;
  country: string;
  notes: string;
  tags: string[];
  avatar: string;
}

interface AddClientFormProps {
  onOpenChange: (open: boolean) => void;
}

const initialFormData: ClientFormData = {
  name: "",
  email: "",
  phone: "",
  industry: "",
  stage: "",
  owner: "",
  country: "",
  notes: "",
  tags: [],
  avatar: "",
};

export function AddClientForm({ onOpenChange }: AddClientFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting client data:', formData);
    toast({
      title: t("toasts.addClient.success.title"),
      description: t("toasts.addClient.success.description"),
    });
    onOpenChange(false);
    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileSection formData={formData} t={t} />
      <BasicInfoSection formData={formData} setFormData={setFormData} t={t} />
      <BusinessInfoSection formData={formData} setFormData={setFormData} t={t} />
      <TagsSection
        tags={formData.tags}
        onTagsChange={(newTags) => setFormData({ ...formData, tags: newTags })}
        t={t}
      />
      <NotesSection
        notes={formData.notes}
        onNotesChange={(newNotes) => setFormData({ ...formData, notes: newNotes })}
        t={t}
      />
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit">{t('addClientModal.submitButton')}</Button>
      </div>
    </form>
  );
}
