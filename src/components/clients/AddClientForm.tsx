import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';

import {
  BasicInfoSection,
  BusinessInfoSection,
  TagsSection,
  NotesSection,
  OwnershipSection,
} from './client-form-sections';

import { Button } from '@/components/ui/button';

interface ClientInsert {
  name: string;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  stage?: string | null;
  country?: string | null;
  address?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  owner_id: string;
  subowner_id?: string | null;
  owner_earnings?: number;
  subowner_earnings?: number;
  total_earnings?: number;
  owner_percentage?: number;
  subowner_percentage?: number;
  contacts_count?: number;
  total_deal_value?: number;
  owner_suggested_percentage?: number | null;
  subowner_suggested_percentage?: number | null;
  owner_agreed?: boolean;
  subowner_agreed?: boolean;
  is_finalized?: boolean;
  status?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  industry: string;
  stage: string;
  owner: string;
  subowner: string;
  owner_earnings: number;
  subowner_earnings: number;
  total_earnings: number;
  owner_percentage: number;
  subowner_percentage: number;
  total_deal_value: number;
  owner_suggested_percentage?: number;
  subowner_suggested_percentage?: number;
  owner_agreed?: boolean;
  subowner_agreed?: boolean;
  is_finalized?: boolean;
  country: string;
  address: string;
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
  subowner: '',
  owner_earnings: 0,
  subowner_earnings: 0,
  total_earnings: 0,
  owner_percentage: 100, // Default: owner gets 100% (30% of deal value) when no subowner
  subowner_percentage: 0, // Default: no subowner
  total_deal_value: 0, // Start with 0 for new clients
  owner_suggested_percentage: undefined,
  subowner_suggested_percentage: undefined,
  owner_agreed: false,
  subowner_agreed: false,
  is_finalized: false,
  country: '',
  address: '',
  notes: '',
  tags: [],
};

export function AddClientForm({ onOpenChange, onClientAdded }: AddClientFormProps) {
  const { t } = useTranslation(['clients', 'common']);
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
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
        stage: formData.stage || 'lead',
        country: formData.country || null,
        address: formData.address || null,
        notes: formData.notes || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        owner_id: formData.owner || user.id,
        subowner_id: formData.subowner || null,
        owner_earnings: formData.owner_earnings || 0,
        subowner_earnings: formData.subowner_earnings || 0,
        total_earnings: formData.total_earnings || 0,
        owner_percentage: formData.owner_percentage || 100,
        subowner_percentage: formData.subowner_percentage || 0,
        contacts_count: 0,
        total_deal_value: formData.total_deal_value || 0,
        owner_suggested_percentage: formData.owner_suggested_percentage || null,
        subowner_suggested_percentage: formData.subowner_suggested_percentage || null,
        owner_agreed: formData.owner_agreed || false,
        subowner_agreed: formData.subowner_agreed || false,
        is_finalized: formData.is_finalized || false,
        status: 'active',
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

      // Create notifications for the new client
      if (data?.id && user?.id && userProfile?.role) {
        await notificationService.notifyClientAdded(
          formData.name,
          data.id,
          {
            userId: user.id,
            userRole: userProfile.role as 'admin' | 'manager' | 'user'
          }
        );
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
      <OwnershipSection formData={formData} setFormData={setFormData} />
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
