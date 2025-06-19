import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { contactsService, type ContactInput } from '@/services/contactsService';
import { notificationService } from '@/services/notificationService';
import {
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
  onContactAdded?: () => void;
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
};

export function AddContactForm({ onOpenChange, onContactAdded }: AddContactFormProps) {
  const { t } = useTranslation('addContactModal');
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !userProfile?.role) {
      toast({
        title: t('addContactModal.error'),
        description: "User authentication required",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.firstName.trim()) {
      toast({
        title: t('addContactModal.error'),
        description: t('addContactModal.firstNameRequired'),
        variant: "destructive"
      });
      return;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: t('addContactModal.error'),
        description: t('addContactModal.lastNameRequired'),
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: t('addContactModal.error'),
        description: t('addContactModal.emailRequired'),
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t('addContactModal.error'),
        description: t('addContactModal.emailInvalid'),
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate email
    try {
      const { data: existingContact } = await contactsService.checkEmailExists(formData.email);
      if (existingContact) {
        toast({
          title: t('addContactModal.error'),
          description: t('addContactModal.emailAlreadyExists'),
          variant: "destructive"
        });
        return;
      }
    } catch (emailCheckError) {
      console.warn('Could not check for duplicate email:', emailCheckError);
      // Continue with submission - let the database handle the constraint
    }

    setLoading(true);

    try {
      const contactInput: ContactInput = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role.trim(),
        company: formData.company.trim(),
        country: formData.country.trim(),
        status: (formData.status || 'Active') as 'Active' | 'Inactive',
        tags: formData.tags,
        notes: formData.notes.trim(),
      };

      const newContact = await contactsService.createContact(contactInput, {
        userId: user.id,
        userRole: userProfile.role
      });

      // Create notifications for the new contact
      if (newContact?.id) {
        await notificationService.notifyContactAdded(
          `${formData.firstName} ${formData.lastName}`,
          newContact.id.toString(),
          {
            userId: user.id,
            userRole: userProfile.role
          }
        );
      }

      toast({
        title: t('addContactModal.successTitle'),
        description: t('addContactModal.contactAdded'),
      });

      // Reset form
      setFormData(initialFormData);
      
      // Call the callback to refresh the contacts list
      onContactAdded?.();
      
      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating contact:', error);
      
      // Handle specific database errors
      let errorMessage = t('addContactModal.createFailed');
      
      if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
          case '23505': // Unique constraint violation
            if (error.message?.includes('contacts_email_key')) {
              errorMessage = t('addContactModal.emailAlreadyExists');
            } else {
              errorMessage = t('addContactModal.duplicateContact');
            }
            break;
          case '23503': // Foreign key constraint violation
            errorMessage = t('addContactModal.invalidReference');
            break;
          default:
            errorMessage = error.message || t('addContactModal.createFailed');
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('addContactModal.error'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection formData={formData} setFormData={setFormData} />
      <ProfessionalInfoSection formData={formData} setFormData={setFormData} />
      <LocationStatusSection formData={formData} setFormData={setFormData} />
      <TagsSection formData={formData} setFormData={setFormData} />
      <NotesSection formData={formData} setFormData={setFormData} />
      
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          {t('addContactModal.cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t('addContactModal.creating') : t('addContactModal.addContact')}
        </Button>
      </div>
    </form>
  );
}
