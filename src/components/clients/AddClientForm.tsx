import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

import {
  BasicInfoSection,
  BusinessInfoSection,
  TagsSection,
  NotesSection,
} from './client-form-sections';

import { Button } from '@/components/ui/button';

type ClientInsert = Database['public']['Tables']['clients']['Insert'];

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
}

interface AddClientFormProps {
  onOpenChange: (open: boolean) => void;
  onClientAdded?: () => void;
}

const initialFormData: ClientFormData = {
  name: '',
  email: '',
  phone: '',
  industry: '',
  stage: '',
  owner: '',
  country: '',
  notes: '',
  tags: [],
};

export function AddClientForm({ onOpenChange, onClientAdded }: AddClientFormProps) {
  const { t } = useTranslation(['clients', 'common']);
  const { user } = useAuth();
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: t('clients.toasts.addClient.error.title'),
        description: t('clients.toasts.addClient.error.missingFields'),
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: t('clients.toasts.addClient.error.title'),
        description: 'You must be logged in to create clients.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData: ClientInsert = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        industry: formData.industry || null,
        stage: (formData.stage || 'lead') as Database['public']['Enums']['client_stage'],
        country: formData.country || null,
        notes: formData.notes || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        owner_id: user.id,
        contacts_count: 0,
        total_deal_value: 0,
        status: 'active' as Database['public']['Enums']['user_status'],
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        toast({
          title: t('clients.toasts.addClient.error.title'),
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('clients.toasts.addClient.success.title'),
        description: t('clients.toasts.addClient.success.description'),
      });

      onOpenChange(false);
      setFormData(initialFormData);

      if (onClientAdded) {
        onClientAdded();
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: t('clients.toasts.addClient.error.title'),
        description: t('clients.toasts.addClient.error.unexpected'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection formData={formData} setFormData={setFormData} />
      <BusinessInfoSection formData={formData} setFormData={setFormData} />
      <TagsSection
        tags={formData.tags}
        onTagsChange={(newTags) => setFormData({ ...formData, tags: newTags })}
      />
      <NotesSection
        notes={formData.notes}
        onNotesChange={(newNotes) => setFormData({ ...formData, notes: newNotes })}
      />
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('clients.addClientModal.creating') : t('clients.addClientModal.submit')}
        </Button>
      </div>
    </form>
  );
}
